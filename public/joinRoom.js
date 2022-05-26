function joinRoom(roomName) {
    document.getElementById('search-box').value = '';
    nsSocket.emit('joinRoom', roomName);

    nsSocket.on('historyCatchUp', (messages) => {
        document.querySelector('.room-header__title').textContent = roomName;
        const messagesUl = document.getElementById('messages')
        messagesUl.innerHTML = '';
        localMessages = []
        messages.forEach(message => {
            // load messages directly on HTML
            messagesUl.innerHTML += buildHTML(message)
            // push messages to our local array
            localMessages.push(message);
        })
        messagesUl.scrollTo(0, messagesUl.scrollHeight);
        console.log(messages)
        console.log(localMessages)
    })

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.room-header__users').innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span>`;
    })
}