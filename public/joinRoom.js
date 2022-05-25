function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfUsers) => {
        document.querySelector('.room-header__users').innerHTML = `${newNumberOfUsers}<span class="glyphicon glyphicon-user"></span>`;
    });
    nsSocket.on('historyCatchUp', (messages) => {
        const messagesUl = document.getElementById('messages')
        messagesUl.innerHTML = '';
        messages.forEach(message => {
            console.log(message)
            messagesUl.innerHTML += buildHTML(message);
        })
        messagesUl.scrollTo(0, messagesUl.scrollHeight);
    })
}