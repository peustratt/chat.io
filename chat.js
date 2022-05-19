const express = require('express');
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('public/chat.html', { root: __dirname });
});

const expressServer = app.listen(process.env.PORT || 8080, () => {
    console.log('server listening on port 8080!')
});

const io = socketio(expressServer);
io.on('connection', (socket) => {
    socket.on('messageToServer', (dataFromClient) => {
        const time = new Date();
        const newData = {...dataFromClient, time: `${time.getHours()}:${time.getMinutes()}`}
        io.emit('messageFromServer', (newData));
    })

    socket.on('isTyping', () => {
        socket.broadcast.emit('isTyping')
    })

    socket.on('stopedTyping', () => {
        socket.broadcast.emit('stopedTyping')
    })
})

