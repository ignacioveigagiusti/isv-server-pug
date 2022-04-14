const express = require('express');
const { Router } = express;
const fs = require('fs');
const { Server: IOServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productRouter = new Router();

const Products = require('./api/products.js');
const productContainer = new Products('./api/products.json');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
productRouter.use(express.json());
productRouter.use(express.urlencoded({ extended: false }));

// Pug settings for templating
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// index.html is sent when performing a get on the root directory
app.get('/', async (req, res) => {
    let allProducts = []
    try {
        allProducts = await productContainer.getAll();
    } catch (err) {
        res.render('pages/index.pug', {error: err});
    }
    res.render('pages/index.pug');
})

app.post('/', async (req, res) => {
    try {
        if( req.body.title == undefined || req.body.price === null || req.body.thumbnail == undefined || req.body.category == undefined || req.body.stock == null || req.body.title == '' || req.body.price === '' || req.body.thumbnail == '' || req.body.category == '' || req.body.stock == '' ) {
            throw 'Missing data. Product needs Title, Price, Thumbnail, Category and Stock.'
        }
        let category = req.body.category;
        let subcategory = req.body.subcategory;
        let title = req.body.title;
        let description = req.body.description;
        let price = req.body.price;
        let stock = req.body.stock;
        let thumbnail = req.body.thumbnail;
        price = parseFloat(price);
        stock = parseFloat(stock);
        const newProduct = {category:category, subcategory:subcategory, title:title, description:description, price:price, stock:stock, thumbnail:thumbnail};
        const savedProduct = await productContainer.save(newProduct);
        res.send(JSON.stringify(savedProduct));
    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/edit', async (req, res) => {
    try {
        let putId;
        if (req.body.id != null && req.body.id !== '') {
            putId = req.body.id;
        }
        else{
            throw 'No ID was provided';
        }
        const prevProduct = await productContainer.getById(putId);
        let newCategory = prevProduct.category;
        let newSubcategory = prevProduct.subcategory;
        let newTitle = prevProduct.title;
        let newDescription = prevProduct.description;
        let newPrice = prevProduct.price;
        let newStock = prevProduct.stock;
        let newThumbnail = prevProduct.thumbnail;
        if (typeof req.body.category === 'string' && req.body.category !== '') {
            newCategory = req.body.category;
        }
        if (typeof req.body.subcategory === 'string' && req.body.subcategory !== '') {
            newSubcategory = req.body.subcategory;
        }
        if (typeof req.body.title === 'string' && req.body.title !== '') {
            newTitle = req.body.title;
        }
        if (typeof req.body.description === 'string' && req.body.description !== '') {
            newDescription = req.body.description;
        }
        if (!isNaN(req.body.price) && req.body.price && req.body.price !== '') {
            newPrice = parseFloat(req.body.price);
        }
        if (!isNaN(req.body.stock) && req.body.stock && req.body.stock !== '') {
            newStock = parseFloat(req.body.stock);
        }      
        if (typeof req.body.thumbnail === 'string' && req.body.thumbnail !== '') {   
            newThumbnail = req.body.thumbnail;
        }
        const newProduct = {category:newCategory, subcategory:newSubcategory, title:newTitle, description:newDescription, price:newPrice, stock:newStock, thumbnail:newThumbnail};
        const editProduct = await productContainer.edit(putId, newProduct).catch((err) => {
            throw err
        });
        res.send(editProduct);
    } catch (err) {
        res.status(400).send(err.message || err);
    }
});

app.get('/products', async (req, res) => {
    let allProducts = []
    try {
        allProducts = await productContainer.getAll();
    } catch (err) {
        res.render('pages/productView.pug', {error: err});
    }
    res.render('pages/productView.pug', {productList: allProducts});
})

// get all products from /api/products
productRouter.get('/', async (req, res) => {
    try {
        const allProducts = await productContainer.getAll();
        res.json(allProducts);
    } catch (err) {
        res.send(`${err}`);
    }    
});

// get one product by id from /api/products/:id
productRouter.get('/:id', async (req, res) => {
    try {
        const param = req.params.id;
        const product = await productContainer.getById(param);
        res.json(product);
    } catch (err) {
        res.send(`${err}`);
    }
});

// add one product with a post method to /api/products
productRouter.post('/', async (req, res) => {
    try {
        if( req.body.title == undefined || req.body.price === null || req.body.thumbnail == undefined || req.body.category == undefined || req.body.stock == null || req.body.title == '' || req.body.price === '' || req.body.thumbnail == '' || req.body.category == '' || req.body.stock == '' ) {
            throw 'Missing data. Product needs Title, Price, Thumbnail, Category and Stock.'
        }
        let category = req.body.category;
        let subcategory = req.body.subcategory || ' ';
        let title = req.body.title;
        let description = req.body.description || ' ';
        let price = req.body.price;
        let stock = req.body.stock;
        let thumbnail = req.body.thumbnail;
        price = parseFloat(price);
        stock = parseFloat(stock);
        const newProduct = {category:category, subcategory:subcategory, title:title, description:description, price:price, stock:stock, thumbnail:thumbnail};
        const savedProduct = await productContainer.save(newProduct);
        res.send(`Producto añadido: ${JSON.stringify(savedProduct)}`);
    } catch (err) {
        res.send(`${err}`);
    }
});

// PUT method to edit a product by ID (this is the one that can be tested with postman)
productRouter.put('/:id', async (req, res) => {
    try {
        const param = req.params.id;
        const prevProduct = productContainer.getById(param);
        let newCategory = prevProduct.category;
        let newSubcategory = prevProduct.subcategory || '';
        let newTitle = prevProduct.title;
        let newDescription = prevProduct.description || '';
        let newPrice = prevProduct.price;
        let newStock = prevProduct.stock;
        let newThumbnail = prevProduct.thumbnail;
        if (typeof req.body.category === 'string' && req.body.category !== '') {
            newCategory = req.body.category;
        }
        if (typeof req.body.subcategory === 'string' && req.body.subcategory !== '') {
            newSubcategory = req.body.subcategory;
        }
        if (typeof req.body.title === 'string' && req.body.title !== '') {
            newTitle = req.body.title;
        }
        if (typeof req.body.description === 'string' && req.body.description !== '') {
            newDescription = req.body.description;
        }
        if (parseFloat(req.body.price) != null && req.body.price !== '') {
            newPrice = parseFloat(req.body.price);
        }
        if (parseFloat(req.body.stock) != null && req.body.stock !== '') {
            newStock = parseFloat(req.body.stock);
        }      
        if (typeof req.body.thumbnail === 'string' && req.body.thumbnail !== '') {   
            newThumbnail = req.body.thumbnail;
        }
        const newProduct = {category:newCategory, subcategory:newSubcategory, title:newTitle, description:newDescription, price:newPrice, stock:newStock, thumbnail:newThumbnail};
        await productContainer.edit(param, newProduct);
        res.json({id:param, ...newProduct});
    } catch (err) {
        res.send(`${err}`);
    }
});

// Delete a product by ID
productRouter.delete('/:id', async (req, res) => {
    try {
        const param = req.params.id;
        await productContainer.deleteById(param);
        res.send(`producto con id: ${param} eliminado exitosamente`);
    } catch (err) {
        res.send(`${err}`);
    }
});

//Router
app.use('/api/products', productRouter);

//Connection
const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${httpServer.address().port}`)
});
httpServer.on("error", err => console.log(`Error en el servidor: ${err}`));

io.on('connection', async (socket) => {
    console.log('Client connected');
    const messages = JSON.parse(await fs.promises.readFile('./api/messages.json', 'utf8'));
    try {
        socket.emit('messages', messages);
    } catch (err) {
        io.sockets.emit('msgError', err.message);
    }
    let products;
    try {
        products = await productContainer.getAll();
        socket.emit('products', products);
    } catch (err) {
        io.sockets.emit('prodError', err.message);
    }
    socket.on('newMessage', async data => {
        try {
            messages.push(data);
            await fs.promises.writeFile('./api/messages.json', JSON.stringify(messages,null,2));
            io.sockets.emit('messages', messages);    
        } catch (err) {
            io.sockets.emit('msgError', err.message);
        }
    });
    socket.on('productEvent', async () => {
        try {
            products = await productContainer.getAll();
            io.sockets.emit('products', products);
        } catch (err) {
            io.sockets.emit('prodError', err.message);
        }
    });
})