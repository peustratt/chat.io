const http = require('http');
const socketio = require('socket.io')

const server = http.createServer((req, res) => {
    res.end("I am connected!")
})

const io = socketio(server);

server.listen(8000)