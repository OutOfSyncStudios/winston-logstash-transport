# winston-logstash-transport

[![NPM](https://nodei.co/npm/winston3-logstash-transport.png?downloads=true)](https://nodei.co/npm/winston3-logstash-transport/)

[![Actual version published on npm](http://img.shields.io/npm/v/winston3-logstash-transport.svg)](https://www.npmjs.org/package/winston3-logstash-transport)
[![Travis build status](https://travis-ci.org/OutOfSyncStudios/winston-logstash-transport.svg)](https://www.npmjs.org/package/winston3-logstash-transport)
[![Total npm module downloads](http://img.shields.io/npm/dt/winston3-logstash-transport.svg)](https://www.npmjs.org/package/winston3-logstash-transport)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/bdc0361233984923a764b05710a2f2f9)](https://www.codacy.com/app/OutOfSyncStudios/winston-logstash-transport?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=OutOfSyncStudios/winston-logstash-transport&amp;utm_campaign=Badge_Grade)
[![Codacy Coverate Badge](https://api.codacy.com/project/badge/Coverage/bdc0361233984923a764b05710a2f2f9)](https://www.codacy.com/app/OutOfSyncStudios/winston-logstash-transport?utm_source=github.com&utm_medium=referral&utm_content=OutOfSyncStudios/winston-logstash-transport&utm_campaign=Badge_Coverage)
[![Dependencies badge](https://david-dm.org/OutOfSyncStudios/winston3-logstash-transport/status.svg)](https://david-dm.org/OutOfSyncStudios/winston-logstash-transport?view=list)

A winston@3 transport for LogStash.

This winston transport has been rewritten from both `winston-logastah` and `winston-logstash-udp` to use the new Transport behavior from winston@3.

Where possible, this has been updated to mimic the behaviors of the original
modules. There are some changes that have been made to allow the transport to
handle either TCP or UDP connections to LogStash, instead of being dedicated to
a single transport-layer protocol.

## Usage

```js
const Winston = require('winston');
const WinstonLogStash = require('winston3-logstash-transport');

const logger = Winston.createLogger();

logger.add(new WinstonLogStash({
  mode: 'udp',
  host: '127.0.0.1',
  port: 28777
}));

logger.error('Some Error');
```

## API

### constructor(options)
Create a new Logstash Transport

### *options*
| Name | Type | Description | Valid Values | Default | TCP | UDP |
|------|------|-------------|--------------|---------|-----|-----|
| `mode` | string | The protocol to use to connect to LogStash. `tcp` is an alias for `tcp4` and `udp` is an alias for `udp4`. | `udp` `udp4` `udp6` `tcp` `tcp4` `tcp6` | `'udp4'` | ✔️ | ✔️ |
| `localhost` | string | The hostname sent to LogStash | Any | `os.hostname` | ✔️ | ✔️ |
| `host` | string | The LogStash server ip or hostname | Any valid IP or host address | `127.0.0.1` (ip4)<br/>`::0` (ip6) | ✔️ | ✔️ |
| `port` | integer | The LogStash server port number | Any integer | `28777` | ✔️ | ✔️ |
| `applicationName` | string | The application name sent to LogStash | Any | `process.title` | ✔️ | ✔️ |
| `pid` | string | The Operating System process ID for this process | Any valid PID | `process.pid` | ✔️ | ✔️ |
| `silent` | boolean | Offline/Silent mode enabled |  | `false` | ✔️ | ✔️ |
| `maxConnectRetries` | integer | The number of attempts to reconnect to make before erroring out | Any integer | `4` | ✔️ | ✔️ |
| `timeoutConnectRetries` | integer | The number of milliseconds to wait between connection attempts | Any integer | `100` | ✔️ | ✔️ |
| `label` | string | The LogStash label to send with the information | Any | `process.title` | ✔️ | ✔️ |
| `sslEnable` | boolean | Whether SSL/TLS connection should be attempted when connecting via TCP |  | `false` | ✔️ |  |
| `sslKey` | filepath | The filepath to the SSL Key | Any valid filepath | `''` | ✔️ |  |
| `sslCert` | filepath | The filepath to the SSL Cert | Any valid filepath | `''` | ✔️ |  |
| `sslCA` | filepath or Array(filepaths) | The filepath(s) to the Certificat Authority (CA) Intermediary Certs | Any valid filepath(s) | `''` | ✔️ |  |
| `sslPassPhrase` | string | The SSL Cert PassPhrase (if any) | Any | `''` | ✔️ |  |
| `rejectUnauthorized` | boolean | Enable connection rejection when cert is not valid |  | `false` | ✔️ |  |
| `trailingLineFeed` | boolean | Enable appending end of line character to UDP output |  | `false` |  | ✔️ |
| `trailingLineFeedChar` | string | The type of end of line character(s) to append to UDP output | Any | `os.EOL` |  | ✔️ |

## [License](#license)
<a name="license"></a>

Copyright (c) 2018, 2019 Jay Reardon
Copyright (c) 2019 Out of Sync Studios LLC -- Licensed under the MIT license.
