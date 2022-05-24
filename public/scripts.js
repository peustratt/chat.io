const socket = io('http://localhost:8080');

socket.on('nsList', (nsData) => {
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    nsData.forEach(namespace => {
        namespacesDiv.innerHTML += `<div class="namespace" ns="${namespace.endpoint}"><img src="${namespace.img}"></div>`
    })

    document.querySelectorAll('.namespace').forEach(element => {
        element.addEventListener('click', (event) => {
            const nsEndpoint = element.getAttribute('ns');
            console.log(nsEndpoint)
        })
    })
    const nsSocket = io('http://localhost:8080/wiki');
    nsSocket.on('nsRoomLoad', nsRooms => {
        const roomsList = document.querySelector('.rooms__list');
        roomsList.innerHTML = ""
        nsRooms.forEach(room => {
            roomsList.innerHTML += `<li class="room"><span></span>${room.roomTitle}</li>`
        })

        const roomLiElements = document.querySelectorAll('.room')
        roomLiElements.forEach(room => {
            room.addEventListener('click', (event) => {
                console.log(`some one clicked on ${event.target.textContent}`)
            })
        })
    })
})


socket.on('messageFromServer', (message) => {
    let myMsg;
    if (message.id === socket.id) {
        myMsg = 'my-msg'
    }
    document.getElementById('messages').innerHTML += `<li class="${myMsg}"><span class="message-text">${message.text}</span><span class="time">${message.time}</span></li>`
})

socket.on('isTyping', () => {
    console.log('is typing')
    const typing = document.createElement('li')
    typing.id = 'is-typing'
    typing.textContent = 'somebody is typing...'
    if (!document.getElementById('is-typing')) {
        document.getElementById('messages').appendChild(typing);
    }
})

socket.on('stopedTyping', () => {
    if (document.getElementById('is-typing')) {
        document.getElementById('is-typing').remove()
    }
})

document.getElementById('message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const newMessage = event.target[0].value
    // Only sends valid string
    if (newMessage.trim()) {
        socket.emit('messageToServer', { text: newMessage, id: socket.id });
        // socket.emit('stopedTyping')
    }
    event.target[0].value = '';
})

document.getElementById('message-input').addEventListener('keyup', (event) => {
    const sendBtn = document.getElementById('send-btn')
    console.log('valor inicial', event.target.value)
    if (event.target.value.trim()) {
        sendBtn.style.background = "rgb(27, 87, 255)"
        socket.emit('isTyping');
    } else {
        sendBtn.style.background = ""
        socket.emit('stopedTyping')
    }
})
