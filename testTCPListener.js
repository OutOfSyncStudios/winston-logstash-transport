const net = require('net');

const Server = net.createServer((socket) => {
  socket.pipe(socket);
  socket.on('data', (data) => {
    console.log(data.toString('UTF8'));
  });
});

// server.listen(28777, '::0');
Server.listen(28777, '127.0.0.1');
