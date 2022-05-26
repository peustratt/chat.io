function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName);

    nsSocket.on('historyCatchUp', (messages) => {
        document.querySelector('.room-header__title').textContent = roomName;
        const messagesUl = document.getElementById('messages')
        messagesUl.innerHTML = '';
        messages.forEach(message => {
            console.log(message)
            messagesUl.innerHTML += buildHTML(message);
        })
        messagesUl.scrollTo(0, messagesUl.scrollHeight);
    })

    nsSocket.on('updateMembers', (numMembers) => {
        document.querySelector('.room-header__users').innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span>`;
    })
}