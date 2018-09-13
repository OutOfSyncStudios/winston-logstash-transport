const Transport = require('winston-transport');
const util = require('util');
const tls = require('tls');
const dgram = require('dgram');
const net = require('net');
const os = require('os');
const fs = require('fs');

var ECONNREFUSED_REGEXP = /ECONNREFUSED/;

class LogstashTransport extends Transport {
  constructor(options) {
    options = options || {};
    super(options);

    this.name = 'logstashTransport';
    this.mode = options.mode || 'udp4';
    this.localhost = options.localhost || os.hostname();
    this.host = options.host || '127.0.0.1';
    this.port = options.port || 28777;
    this.node_name = options.node_name || process.title;
    this.pid = options.pid || process.pid;
    this.silent = options.silent || false;
    this.max_connect_retries = (typeof options.max_connect_retries === 'number') ? options.max_connect_retries : 4;
    this.timeout_connect_retries = (typeof options.timeout_connect_retries === 'number') ? options.timeout_connect_retries : 100;
    this.logstash = options.logstash || false;

    // TCP / TLS Settings
    this.ssl_enable = options.ssl_enable || false;
    this.ssl_key = options.ssl_key || '';
    this.ssl_cert = options.ssl_cert || '';
    this.ca = options.ca || '';
    this.ssl_passphrase = options.ssl_passphrase || '';
    this.rejectUnauthorized = options.rejectUnauthorized === true;

    // Connection state
    this.log_queue = [];
    this.connected = false;
    this.socket = null;
    this.retries = -1;

    // Miscellaneous options
    this.label = options.label || this.node_name;
    this.trailingLineFeed = options.trailingLineFeed === true;
    this.trailingLineFeedChar = options.trailingLineFeedChar || os.EOL;    

    this.connect();
  }

  log(info, callback) {
    if (this.silent) {
      callback(null, true);
      return;
    }

    console.log(info.level);
    console.log(info.message);

    setImmediate(() => {
      this.emit('logged', info);
    });

    // Send some shit to the connection

    callback();
    return;
  }

  deliverTCP(message, callback) {

  }

  deliverUDP(message, callback) {

  }

  connectTCP() {

  }

  connectUDP() {
    this.socket = dgram.createSocket(this.mode);
    this.socket.on('error', () => {
      // Do nothing
    });

    if (this.socket.unref) {
      this.socket.unref();
    }
    this.connected = true;
  }

  connect() {
    switch (this.mode) {
      case 'tcp6':
      case 'tcp': {
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

  close() {
    this.connected = false;
    this.socket.close();
  }
};

module.exports = LogstashTransport;
