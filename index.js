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

// io.on = io.of('/').on
io.on('connection', (socket) => {
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    socket.emit('nsList', nsData);
})


// Chat function
// io.on('connection', (socket) => {
//     
// })

namespaces.forEach(namespace => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has join namespace ${namespace.endpoint}`)
        // a socket has connected to one of our chat namespaces.
        // send that ns rooms info back
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', async (roomToJoin) => {
            nsSocket.join(roomToJoin);
            console.log(`${nsSocket.id} joined room ${roomToJoin}`)
            const allSockets = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
            const clients = Array.from(allSockets);
            const nsRoom = namespace.rooms.find(room => room.roomTitle === roomToJoin)
            nsSocket.emit('historyCatchUp', nsRoom.history);
            io.of(namespace.endpoint).to(roomToJoin).emit('updateMembers', clients.length)
        })

        nsSocket.on('messageToServer', (message) => {
            const time = new Date();
            const hours = time.getHours() - 3;

            const fullMsg = {
                text: message.text,
                time: `${hours < 3 ? hours + 24 : hours}:${time.getMinutes()}`,
                username: 'Pedro',
                id: nsSocket.id,
                avatar: 'https://via.placeholder.com/30'
            }
            
            const roomTitle = Array.from(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
            nsRoom.addMessage(fullMsg);
            io.of(namespace.endpoint).to(roomTitle).emit('messageFromServer', (fullMsg));
            console.log('room title', roomTitle)
            console.log('current room', nsRoom)
        })

        nsSocket.on('isTyping', () => {
            const roomTitle = Array.from(nsSocket.rooms)[1];
            nsSocket.to(roomTitle).emit('isTyping')
        })

        nsSocket.on('stopedTyping', () => {
            const roomTitle = Array.from(nsSocket.rooms)[1];
            nsSocket.to(roomTitle).emit('stopedTyping')
        })
    })
})