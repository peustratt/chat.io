function buildHTML(msg) {
    const msgClass = msg.id === nsSocket.id ? 'my-msg' : ''
    return `<li class="${msgClass}">
                    <div class="user-image">
                        <img src="${msg.avatar}" />
                    </div>
                    <div class="user-message ${msgClass}">
                        <span class="message-text">${msg.text}</span>
                        <span class="time">${msg.time}</span>
                    </div>
                </li>`
}

function joinNs(endpoint) {    
    if (nsSocket) {
        // check to see if nsSocket is alredy connected
        nsSocket.close();
        // remove the form eventListener before it's added again
        document.getElementById('message-form').removeEventListener('submit', formSubmission);
        document.getElementById('message-input').removeEventListener('keyup', typingEvent)
    }

    nsSocket = io(`http://localhost:8080${endpoint}`);
    nsSocket.on('nsRoomLoad', nsRooms => {
        const roomsList = document.querySelector('.rooms__list');
        roomsList.innerHTML = ""
        nsRooms.forEach(room => {
            roomsList.innerHTML += `<li class="room"><span></span>${room.roomTitle}</li>`
        })

        const roomLiElements = document.querySelectorAll('.room')
        roomLiElements.forEach(room => {
            room.addEventListener('click', (event) => {
                const roomName = event.target.textContent;
                console.log(roomName)
                joinRoom(roomName)
            })
        })
        // add room automatically... first time here
        const topRoom = document.querySelector('.room').textContent;
        joinRoom(topRoom)
    })

    // listen for new messages
    nsSocket.on('messageFromServer', (message) => {
        document.getElementById('messages').innerHTML += buildHTML(message);
    })

    document.getElementById('message-form').addEventListener('submit', formSubmission = (event) => {
        event.preventDefault();
        const newMessage = event.target[0].value
        // Only sends valid string
        if (newMessage.trim()) {
            nsSocket.emit('messageToServer', { text: newMessage });
            // socket.emit('stopedTyping')
        }
        console.log(newMessage, nsSocket.id)
        event.target[0].value = '';
    })

    document.getElementById('message-input').addEventListener('keyup', typingEvent = (event) => {
        const sendBtn = document.getElementById('send-btn')
        if (event.target.value.trim()) {
            sendBtn.style.background = "rgb(27, 87, 255)"
            nsSocket.emit('isTyping');
        } else {
            sendBtn.style.background = ""
            nsSocket.emit('stopedTyping')
        }
    })

    nsSocket.on('isTyping', () => {
        const typing = document.createElement('li')
        typing.id = 'is-typing'
        typing.textContent = 'somebody is typing...'
        if (!document.getElementById('is-typing')) {
            document.getElementById('messages').appendChild(typing);
        }
    })

    nsSocket.on('stopedTyping', () => {
        if (document.getElementById('is-typing')) {
            document.getElementById('is-typing').remove()
        }
    })
}