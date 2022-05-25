function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfUsers) => {
        document.querySelector('.room-header__users').innerHTML = `${newNumberOfUsers}<span class="glyphicon glyphicon-user"></span>`;
    });
}