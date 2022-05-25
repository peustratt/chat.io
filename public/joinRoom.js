function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfUsers) => {
        document.querySelector('.room-header__users').innerHTML = `${newNumberOfUsers}<span class="glyphicon glyphicon-user"></span>`;
    });
    nsSocket.on('historyCatchUp', (messages) => {
        messages.forEach(message => {
            console.log(message)
            document.getElementById('messages').innerHTML += buildHTML(message);
        })
    })
}