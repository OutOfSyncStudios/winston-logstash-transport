const util = require('util');
const forEach = require('lodash.foreach');
const merge = require('lodash.merge');
const Transport = require('winston-transport');

const os = require('os');
const dgram = require('dgram');
const tls = require('tls');
const net = require('net');
const fs = require('fs');

class LogstashTransport extends Transport {
  constructor(options) {
    const defaults = {
      mode: 'udp4',
      localhost: os.hostname(),
      host: '127.0.0.1',
      port: 28777,
      applicationName: process.title,
      pid: process.pid,
      silent: false,
      maxConnectRetries: 4,
      timeoutConnectRetries: 100,
      sslEnable: false,
      sslKey: '',
      sslCert: '',
      sslCA: '',
      sslPassPhrase: '',
      rejectUnauthorized: false,
      label: process.title,
      trailingLineFeed: false,
      trailingLineFeedChar: os.EOL,
      level: 'info',
      formatted: true
    };

    options = options || {};
    options.applicationName = options.applicationName || options.appName || process.title;
    options = merge(defaults, options);
    super(options);

    this.silent = options.silent;
    // Assign all options to local properties
    forEach(options, (value, key) => {
      this[key] = value;
    });
    this.name = 'logstashTransport';

    if (this.mode === 'tcp') { this.mode = 'tcp4'; }
    if (this.mode === 'udp') { this.mode = 'udp4'; }
    if (this.mode.substr(3, 4) === '6' && this.host === '127.0.0.1') {
      this.host = '::0';
    }

    // Connection state
    this.logQueue = [];
    this.connectionState = 'NOT CONNECTED';
    this.socketmode = null;
    this.socket = null;
    this.retries = -1;

    this.connect();
  }

  tryStringify(data) {
    let msg;
    // when options.formatted is false this will always be skipped
    if (typeof data !== 'object') {
      const strData = data;
      data = { data: strData };
    }
    try {
      msg = JSON.stringify(data);
    } catch (err) {
      msg = util.inspect(data, { depth: null });
    }
    return msg;
  }

  log(info, callback) {
    if (this.silent) {
      callback(null, true);
      return;
    }

    if (info.message) {
      let output;
      if (!this.formatted) {
        output = this.tryStringify(info);
      } else {
        const msg = this.tryStringify(info.message);
        output = JSON.stringify({
          timestamp: new Date().toISOString(),
          message: msg,
          level: info.level,
          label: this.label,
          application: this.applicationName,
          serverName: this.localhost,
          pid: this.pid
        });
      }

      if (this.connectionState !== 'CONNECTED') {
        this.logQueue.push({
          message: output,
          callback: (() => {
            this.emit('logged', info);
            callback();
            // callback(err, !err);
          })
        });
      } else {
        setImmediate(() => {
          try {
            this.deliver(output, () => {
              this.emit('logged', info);
              callback();
              // callback(err, !err);
            });
          } catch (err) {
            callback();
          }
        });
      }
    }

    return;
  }

  deliverTCP(message, callback) {
    callback = callback || (() => {});

    this.socket.write(message, undefined, callback);
  }

  deliverUDP(message, callback) {
    callback = callback || (() => {});

    const buff = Buffer.from(message);

    this.socket.send(buff, 0, buff.length, this.port, this.host, callback);
  }

  deliver(message, callback) {
    if (this.trailingLineFeed) {
      message = message.replace(/\s+$/, '') + this.trailingLineFeedChar;
    }
    switch (this.socketmode) {
      case 'tcp6':
      case 'tcp4': {
        this.deliverTCP(message, callback);
        break;
      }
      case 'udp6':
      case 'udp4':
      default: {
        this.deliverUDP(message, callback);
        break;
      }
    }
  }

  connectTCP() {
    const options = {
      host: this.host,
      port: this.port
    };

    if (this.sslEnable) {
      options.key = this.sslKey ? fs.readFileSync(this.sslKey) : null;
      options.cert = this.sslCert ? fs.readFileSync(this.sslCert) : null;
      options.passphrase = this.sslPassPhrase || null;
      options.rejectUnauthorized = (this.rejectUnauthorized === true);

      if (this.ca) {
        options.ca = [];
        forEach(this.ca, (value) => {
          options.ca.push(fs.readFileSync(value));
        });
      }

      this.socket = tls.connect(options, () => {
        this.socket.setEncoding('UTF-8');
        this.announce();
        this.connectionState = 'CONNECTED';
      });
    } else {
      this.socket = new net.Socket();
      this.socket.connect(options, () => {
        this.socket.setKeepAlive(true, 60 * 1000);
        this.announce();
        this.connectionState = 'CONNECTED';
      });
    }
    this.hookTCPSocketEvents();
  }

  hookTCPSocketEvents() {
    this.socket.on('error', () => {
      this.connectionState = 'NOT CONNECTED';

      if (this.socket && (typeof this.socket !== 'undefined')) {
        this.socket.destroy();
      }
      this.socket = null;

      this.emit('close');
      // if (!(/ECONNREFUSED/).test(err.message) && !(/socket has been ended/).test(err.message)) {
      //   this.emit('close');
      //   console.log(err);
      //   // setImmediate(() => {
      //   //   this.emit('error', err);
      //   // });
      // } else {
      //   this.emit('close');
      // }
    });

    this.socket.on('timeout', () => {
      if (this.socket.readyState !== 'open') {
        this.socket.destroy();
      }
    });

    this.socket.on('connect', () => {
      this.connectionState = 'CONNECTED';
      this.retries = 0;
    });

    this.socket.on('close', () => {
      if (this.connectionState === 'TERMINATING') {
        return;
      }

      if (this.maxConnectRetries >= 0 && this.retries >= this.maxConnectRetries) {
        this.logQueue = [];
        this.silent = true;
        console.error('Max retries reached, placing transport in OFFLINE/silent mode.');
        // setImmediate(() => {
        //   this.emit('error', new Error('Max retries reached, placing transport in OFFLINE/silent mode.'));
        // });
      } else if (this.connectionState !== 'CONNECTING') {
        setTimeout(() => {
          this.connect();
        }, this.timeoutConnectRetries);
      }
    });
  }

  connectUDP() {
    this.socket = dgram.createSocket(this.mode, { sendBufferSize: 60000 });
    this.socket.on('error', (err) => {
      // Do nothing
      if (!(/ECONNREFUSED/).test(err.message)) {
        console.error(err);
        // setImmediate(() => {
        //   this.emit('error', err);
        // });
      }
    });

    this.socket.on('close', () => {
      this.connectionState = 'NOT CONNECTED';
    });

    if (this.socket.unref) {
      this.socket.unref();
    }
    this.announce();
  }

  connect() {
    if (this.connectionState !== 'CONNECTED') {
      this.socketmode = this.mode;
      this.connectionState = 'CONNECTING';
      switch (this.mode) {
        case 'tcp6':
        case 'tcp4': {
          this.connectTCP();
          break;
        }
        case 'udp6':
        case 'udp4':
        default: {
          this.connectUDP();
          break;
        }
      }
    }
  }

  closeTCP() {
    this.socket.end();
    this.socket.destroy();
    this.socket = null;
    this.connectionState = 'NOT CONNECTED';
  }

  closeUDP() {
    this.socket.close();
    this.connectionState = 'NOT CONNECTED';
  }

  close() {
    if (this.connectionState === 'CONNECTED' && this.socket) {
      this.connectionState = 'TERMINATING';
      switch (this.socketmode) {
        case 'tcp6':
        case 'tcp4': {
          this.closeTCP();
          break;
        }
        case 'udp6':
        case 'udp4':
        default: {
          this.closeUDP();
          break;
        }
      }
      this.socketmode = null;
    }
  }

  flush() {
    while (this.logQueue.length > 0) {
      const elem = this.logQueue.shift();
      this.deliver(elem.message, elem.callback);
    }
  }

  announce() {
    this.flush();
    if (this.connectionState === 'TERMINATING') {
      this.close();
    } else {
      this.connectionState = 'CONNECTED';
    }
  }

  getQueueLength() {
    return this.logQueue.length;
  }
}

module.exports = LogstashTransport;
