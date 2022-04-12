const socket = io.connect()

function addMessage(e) {
    const messageToAdd = {
        author: document.getElementById('userEmail').value,
        text: document.getElementById('userMessage').value
    };
    socket.emit('newMessage', messageToAdd);
    return false;
};

function productEvent(e) {
    socket.emit('productEvent');
};

function renderMessages (data) {
    const html = data.map((elem, index) => {
        return(`<div>
        <strong>${elem.author}</strong>:
        <em>${elem.text}</em>
        </div>`)
    }).join(' ');
    document.getElementById('messages').innerHTML = html;
}

function renderProducts (data) {
    document.querySelectorAll('.productRow').forEach(el => el.remove());
    const html = data.map((elem, index) => {
        return(`<tr class='productRow'>
        <td>${elem.id}</td>
        <td>${elem.title}</td>
        <td><img src=${elem.thumbnail} alt=${elem.title}></td>
        <td>${elem.price}</td>
        </tr>`)
    }).join(' ');
    const template = document.createElement('template');
    template.innerHTML = html;
    document.getElementById('productTable').appendChild(template.content);
}

socket.on('messages', data => {
    renderMessages(data);
})

socket.on('products', data => {
    renderProducts(data);
})