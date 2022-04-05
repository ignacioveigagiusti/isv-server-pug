const express = require('express');
const app = express();
const Products = require('./api/products.js');
const productContainer = new Products('./api/products.json');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.redirect('/api/products')
})

app.get('/api/products', async (req, res) => {
    const allProducts = await productContainer.getAll();
    res.json(allProducts);
});

app.get('/api/products/:id', async (req, res) => {
    const param = req.params.id
    const product = await productContainer.getById(param);
    res.json(product);
});

app.post('/api/products', async (req, res) => {

});

app.put('/api/products/:id', async (req, res) => {
    const param = req.params.id

});

app.delete('/api/products/:id', async (req, res) => {
    const param = req.params.id

});

const server = app.listen(8080, () => {
    console.log(`Servidor inicializado en el puerto ${server.address().port}`)
});
server.on("error", err => console.log(`Error en el servidor: ${err}`));