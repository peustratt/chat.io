const express = require('express');
const app = express();
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('public/chat.html', { root: __dirname });
});

const expressServer = app.listen(process.env.PORT || 8080, () => {
    console.log('server listening on port 8080!')
});
const io = socketio(expressServer);



// Chat function
// io.on('connection', (socket) => {
//     socket.on('messageToServer', (dataFromClient) => {
//         const time = new Date();
//         const hours = time.getHours() - 3;
//         const newData = {...dataFromClient, time: `${hours < 3 ? hours + 24 : hours}:${time.getMinutes()}`}
//         io.emit('messageFromServer', (newData));
//     })

//     socket.on('isTyping', () => {
//         socket.broadcast.emit('isTyping')
//     })

//     socket.on('stopedTyping', () => {
//         socket.broadcast.emit('stopedTyping')
//     })
// })

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', (socket) => {
        console.log(`${socket.id} has joing ${namespace.endpoint}`)
    })
})