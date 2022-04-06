const express = require('express');
const { Router } = express;
const methodOverride = require('method-override')
const app = express();

const bodyParser = require('body-parser');

const productRouter = new Router();

const Products = require('./api/products.js');
const productContainer = new Products('./api/products.json');

productRouter.use(express.json());
productRouter.use(express.urlencoded({ extended: true }));
productRouter.use(bodyParser.urlencoded({ extended: false }));
productRouter.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', {root:__dirname});
})

productRouter.get('/', async (req, res) => {
    const allProducts = await productContainer.getAll();
    res.json(allProducts);
});

productRouter.get('/:id', async (req, res) => {
    const param = req.params.id;
    const product = await productContainer.getById(param);
    res.json(product);
});

productRouter.post('/', async (req, res) => {
    let title = req.body.title;
    let price = req.body.price;
    let thumbnail = req.body.thumbnail;
    price = parseFloat(price);
    const newProduct = {title:title, price:price, thumbnail:thumbnail};
    await productContainer.save(newProduct);
    res.send(`Producto añadido: ${JSON.stringify(newProduct)}`);
});

productRouter.put('/', (req,res) => {
    let putId = req.body.id;
    res.redirect(307, `products/${putId}?_method=PUT`)
})

productRouter.put('/:id', async (req, res) => {
    const param = req.params.id;
    let title = req.body.title;
    let price = req.body.price;
    let thumbnail = req.body.thumbnail;
    price = parseFloat(price);
    const newProduct = {title:title, price:price, thumbnail:thumbnail};
    await productContainer.edit(param, newProduct);
    res.json(newProduct);
});

productRouter.delete('/:id', async (req, res) => {
    const param = req.params.id;
    await productContainer.deleteById(param);
    res.send(`producto con id: ${param} eliminado exitosamente`);
});

app.use('/api/products', productRouter);

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${server.address().port}`)
});
server.on("error", err => console.log(`Error en el servidor: ${err}`));