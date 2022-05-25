function joinNs(endpoint) {    
    const nsSocket = io(`http://localhost:8080${endpoint}`);
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
}