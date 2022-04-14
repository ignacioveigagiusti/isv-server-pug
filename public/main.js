const socket = io.connect()

function checkChatMsg() {
    alert('Please complete all fields correctly');
    return false;
}

function addMessage(e) {
    const userEmail = document.getElementById('userEmail').value;
    const userMessage = document.getElementById('userMessage').value;
    if (!userEmail || !userMessage || !(userEmail.includes('@'))) return checkChatMsg();
    const messageToAdd = {
        author: userEmail,
        timestamp: String(new Date()),
        text: userMessage
    };
    socket.emit('newMessage', messageToAdd);
    return false;
};

function checkAddProduct() {
    alert('Please complete all fields correctly');
    return false;
}

function addProduct(e) {
    e.preventDefault();
    const category = document.getElementById('addCategory').value;
    const subcategory = document.getElementById('addSubcategory').value || '';
    const title = document.getElementById('addTitle').value;
    const description = document.getElementById('addDescription').value || '';
    const price = document.getElementById('addPrice').value;
    const stock = document.getElementById('addStock').value;
    const thumbnail = document.getElementById('addThumbnail').value;
    if (!category || !title || !price || !stock || !thumbnail ) return checkAddProduct();
    const productToAdd = {
        category: category,
        subcategory: subcategory,
        title: title,
        description: description,
        price: price,
        stock: stock,
        thumbnail:thumbnail 
    }
    fetch(window.location.origin, { 
        method: 'POST', 
        body: JSON.stringify(productToAdd),
        headers: {'Content-Type': 'application/json'},
    }).then((res) => {
        socket.emit('productEvent');
        return false;
    }).then((data) => {
        
    }).catch((err) => {
        alert(err);
    })
};

function editProduct(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('editId').value);
    const category = document.getElementById('editCategory').value;
    const subcategory = document.getElementById('editSubcategory').value || '';
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value || '';
    const price = parseFloat(document.getElementById('editPrice').value);
    const stock = parseInt(document.getElementById('editStock').value);
    const thumbnail = document.getElementById('editThumbnail').value;
    if (!id) return checkAddProduct();
    const productToEdit = {
        id: id,
        category: category,
        subcategory: subcategory,
        title: title,
        description: description,
        price: price,
        stock: stock,
        thumbnail:thumbnail 
    }
    fetch(window.location.origin + '/edit', { 
        method: 'POST', 
        body: JSON.stringify(productToEdit),
        headers: {'Content-Type': 'application/json'},
    }).then((res) => {
        socket.emit('productEvent');
        return false;
    }).then((data) => {
        
    }).catch((err) => {
        alert(err);
    })
};

function renderMessages (data) {
    const html = data.map((elem, index) => {
        return(`<div>
        <strong>${elem.author}</strong>:
        <span>${elem.timestamp}</span>
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