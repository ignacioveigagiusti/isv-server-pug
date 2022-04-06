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
    try {
        const allProducts = await productContainer.getAll();
        res.json(allProducts);
    } catch (err) {
        res.send(`${err}`);
    }
    
});

productRouter.get('/:id', async (req, res) => {
    try {
        const param = req.params.id;
        const product = await productContainer.getById(param);
        res.json(product);
    } catch (err) {
        res.send(`${err}`);
    }
});

productRouter.post('/', async (req, res) => {
    try {
        if( req.body.title == undefined || req.body.price === null || req.body.thumbnail == undefined || req.body.title == '' || req.body.price === '' || req.body.thumbnail == '' ) {
            throw 'Missing data. Product needs Title, Price and Thumbnail.'
        }
            let title = req.body.title;
        let price = req.body.price;
        let thumbnail = req.body.thumbnail;
        price = parseFloat(price);
        const newProduct = {title:title, price:price, thumbnail:thumbnail};
        const savedProduct = await productContainer.save(newProduct);
        res.send(`Producto añadido: ${JSON.stringify(savedProduct)}`);
    } catch (err) {
        res.send(`${err}`);
    }
});

productRouter.put('/', (req,res) => {
    try {
        let putId = req.body.id;
        res.redirect(307, `/${putId}?_method=PUT`)
    } catch (err) {
        res.send(`${err}`);
    }
})

productRouter.put('/:id', async (req, res) => {
    try {
        const param = req.params.id;
        let newTitle;
        let newPrice;
        let newThumbnail;
        if (typeof req.body.title === 'string' && req.body.title !== '') {
            newTitle = req.body.title;
        }
        if (req.body.title != null) {
            newPrice = req.body.price;
        }    
        if (typeof req.body.thumbnail === 'string' && req.body.thumbnail !== '') {   
            newThumbnail = req.body.thumbnail;
        }
        newPrice = parseFloat(newPrice);
        const newProduct = {title:newTitle, price:newPrice, thumbnail:newThumbnail};
        await productContainer.edit(param, newProduct);
        res.json({id:param, ...newProduct});
    } catch (err) {
        res.send(`${err}`);
    }
});

productRouter.delete('/:id', async (req, res) => {
    try {
        const param = req.params.id;
        await productContainer.deleteById(param);
        res.send(`producto con id: ${param} eliminado exitosamente`);
    } catch (err) {
        res.send(`${err}`);
    }
});

app.use('/api/products', productRouter);

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${server.address().port}`)
});
server.on("error", err => console.log(`Error en el servidor: ${err}`));