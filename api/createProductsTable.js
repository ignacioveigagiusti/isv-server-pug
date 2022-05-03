const prodOptions = require('./options/mysqlDB'); 
const knex = require('knex')(prodOptions);

const products = [
    {
        "id": 1,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Lana de Vidrio (m)",
        "category": "Productos",
        "cat": "productos",
        "subcategory": "",
        "description": "Aislante de lana de Vidrio hidrorepelente Isover revestido en una de sus caras con velo de vidrio reforzado. Aislamiento térmico y acústico, para instalaciones en paredes, sobre techos inclinados o cielorrasos suspendidos y entretechos en posición horizontal o inclinado sin carga.",
        "price": 450,
        "stock": 10,
        "thumbnail": "https://isvshop.netlify.app/assets/acustiverR.png"
    },
    {
        "id": 2,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Placa de Lana de Vidrio",
        "category": "Productos",
        "cat": "productos",
        "subcategory": "",
        "description": "Paneles de lana de vidrio ISOVER G3. Aislamiento acústico y térmico, diseñado para sistemas en seco y sobre cielorrasos de cualquier tipo. Tratamiento fonoabsorbente de locales para disminuir el Tiempo de Reverberación de los mismos. Sirve como revestimiento de muros, en el interior de tabiques y cielorrasos.",
        "price": 450,
        "stock": 8,
        "thumbnail": "https://isvshop.netlify.app/assets/acustiverP.png"
    },
    {
        "id": 3,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Placa de Yeso (m²)",
        "category": "Productos",
        "cat": "productos",
        "subcategory": "",
        "description": "Placas de yeso, solución estándar para renovar o construir paredes, cielorrasos y revestimientos interiores en ambientes secos, como dormitorios, oficinas, locales comerciales, etc.",
        "price": 500,
        "stock": 0,
        "thumbnail": "https://isvshop.netlify.app/assets/durlock.png"
    },
    {
        "id": 4,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Vidrio PVB (m²)",
        "category": "Productos",
        "cat": "productos",
        "subcategory": "",
        "description": "Vidrio laminado con placa interior de PVB. Aislamiento térmico y acústico para ventanas y puertas, con la posibilidad de utilizarse en arreglos de doble vidriado con cámara de aire para un aislamiento aún mayor.",
        "price": 10000,
        "stock": 7,
        "thumbnail": "https://isvshop.netlify.app/assets/glass.png"
    },
    {
        "id": 5,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Mantenimiento (h)",
        "category": "Servicios",
        "cat": "servicios",
        "subcategory": "",
        "description": "Mantenimiento, arreglo y refacción de cerramientos existentes que hayan podido haber perdido parte de sus cualidades de absorción, reflexión o aislamiento acústico.",
        "price": 1000,
        "stock": 1,
        "thumbnail": "https://isvshop.netlify.app/assets/aislamiento.png"
    },
    {
        "id": 6,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Instalación (h)",
        "category": "Servicios",
        "cat": "servicios",
        "subcategory": "",
        "description": "Instalación de soluciones constructivas con fines primordialmente acústicos.",
        "price": 1500,
        "stock": 1,
        "thumbnail": "https://isvshop.netlify.app/assets/aislamiento.png"
    },
    {
        "id": 7,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Asesoramiento (h)",
        "category": "Servicios",
        "cat": "servicios",
        "subcategory": "",
        "description": "Asesoramiento y planeamiento de soluciones constructivas para recintos desde una perspectiva acústica.",
        "price": 1500,
        "stock": 1,
        "thumbnail": "https://isvshop.netlify.app/assets/absorcion.png"
    },
    {
        "id": 8,
        "timestamp": "Mon May 02 2022 14:33:40 GMT-0300",
        "name": "Desarrollo de Aplicaciones (h)",
        "category": "Programación",
        "cat": "programacion",
        "subcategory": "",
        "description": "Programación de aplicaciones con fines ingenieriles relacionados al ámbito de la acústica. Lenguajes: MATLAB, Python, R, posibilidad de desarrollo de app web (MERN Stack).",
        "price": 2500,
        "stock": 1,
        "thumbnail": "https://isvshop.netlify.app/assets/logoISV.png"
    }
];

const createProductsTable = async() => {
    knex.schema.dropTableIfExists('products')
    .then(async()=>{
      await knex.schema.createTable('products', table => {
        table.increments('id')
        table.string('timestamp');
        table.string('name');
        table.string('category');
        table.string('cat');
        table.string('subcategory');
        table.string('description');
        table.integer('price');
        table.integer('stock');
        table.string('thumbnail');
      });
      await knex('products').insert(products);
    })
    .finally(async()=>{
      knex('products').select('*').then((rows) => {
      let rowsarr = rows;
      rowsarr.map(row => console.log(row));
      });
    })}
    
    createProductsTable();