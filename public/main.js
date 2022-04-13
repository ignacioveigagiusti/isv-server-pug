const socket = io.connect()

function checkChatMsg() {
    alert('Please complete all fields correctly')
    return false
}

function addMessage(e) {
    const userEmail = document.getElementById('userEmail').value
    const userMessage = document.getElementById('userMessage').value
    if (!userEmail || !userMessage || !(userEmail.includes('@'))) return checkChatMsg()
    const messageToAdd = {
        author: userEmail,
        text: userMessage
    };
    socket.emit('newMessage', messageToAdd);
    return false;
};

function productEvent(e) {
    socket.emit('productEvent');
    return false
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
        <td>${elem.category}</td>
        <td>${elem.subcategory}</td>
        <td>${elem.title}</td>
        <td><img src=${elem.thumbnail} alt=${elem.title}></td>
        <td>${elem.price}</td>
        <td>${elem.stock}</td>
        </tr>`)
    }).join(' ');
    const template = document.createElement('template');
    template.innerHTML = html;
    document.getElementById('productTable').appendChild(template.content);
}

socket.on('messages', data => {
    renderMessages(data);
})

socket.on('msgError', data => {
    const html = `Error: ${data}`;
    document.getElementById('messages').innerHTML = html;
})

socket.on('products', data => {
    renderProducts(data);
})

socket.on('prodError', data => {
    const html = `<tr class='productRow'> <td> ${data} </td> </tr>`
    const template = document.createElement('template');
    template.innerHTML = html;
    document.getElementById('productTable').appendChild(template.content);
})