const dgram = require('dgram');

const socket = dgram.createSocket('udp4');

socket.on('message', (message) => {
  console.log(message.toString('UTF8'));
});
socket.bind(28777);
