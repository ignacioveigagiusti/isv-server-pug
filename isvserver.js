const express = require('express');
const app = express();
const Container = require('./products/container.js');
const productContainer = new Container('./products/products.json');

app.get('/', (req, res) => {
    res.redirect('/products')
})

app.get('/products', async (req, res) => {
    const allProducts = await productContainer.getAll();
    res.json(allProducts);
});

app.get('/randomProduct', async (req, res) => {
    const allProducts = await productContainer.getAll();
    let randomId = Math.floor(Math.random() * allProducts.length) +1;
    const randomProduct = await productContainer.getById(randomId)
    res.json(randomProduct)
});

const server = app.listen(8080, () => {
    console.log(`Servidor inicializado en el puerto ${server.address().port}`)
});
server.on("error", err => console.log(`Error en el servidor: ${err}`));