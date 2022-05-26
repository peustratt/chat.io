const socket = io('https://peus-chat-io.herokuapp.com/');
let nsSocket = ""

socket.on('nsList', (nsData) => {
    const namespacesDiv = document.querySelector('.namespaces');
    namespacesDiv.innerHTML = '';
    for (let namespace of nsData) {
        namespacesDiv.innerHTML += `<div class="namespace" ns="${namespace.endpoint}"><img src="${namespace.img}"></div>`
    }
    // join the first namespace
    joinNs(document.querySelector('.namespace').getAttribute('ns'))

    document.querySelectorAll('.namespace').forEach(element => {
        element.addEventListener('click', (event) => {
            const nsEndpoint = element.getAttribute('ns');
            console.log(nsEndpoint)
            joinNs(nsEndpoint)
        })
    })

})
