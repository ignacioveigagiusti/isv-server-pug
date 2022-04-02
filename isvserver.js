const express = require('express')

const app = express()

const server = app.listen(8080, () => {
    console.log(`Servidor http inicializado en el puerto ${server.address().port}`)
});
server.on('error', err = console.log(`Error en el servidor: ${err}`))
