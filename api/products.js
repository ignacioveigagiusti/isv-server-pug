class Products {
    
    constructor(options, tableName){
        this.knex = require('knex')(options);
        this.tableName = tableName;
    }


    async save(product) {
        try{
            let getContent = [];
            await this.knex(this.tableName).select("*").then((rows) => {
                let rowsarr = rows;
                rowsarr.map(row => getContent.push(JSON.parse(JSON.stringify(row))));
            });
            if (getContent == '') {
                getContent = '[]';
            }
            const prevContent = getContent; 
            // Extract IDs into an array
            let indexArray = [];
            for (const i in prevContent) {
                indexArray.push(prevContent[i].id);
            }
            // By default, the new ID is the number of current IDs + 1
            let newID = indexArray.length + 1;
            // Search for a missing ID in the ID Array. If a gap is found, the new ID will be set to that number
            if (indexArray.length > 0) {
                indexArray = indexArray.sort((a,b) => a - b )
                for (let i = 0; i < indexArray.length; i++) {
                    if ( (indexArray[i] - i) != 1){
                        newID = i+1;
                        break
                    }
                }
            }
            const newProduct = {id: newID, timestamp: String(new Date()).slice(0,33), ...product};
            //KNEX
            await this.knex(this.tableName).insert(newProduct);
            console.log('Escritura exitosa!');
            
            return newProduct;
        }
        catch(err){
            throw new Error(`${err}`)
        }
    }

    async edit(productId, product) {
        try{
            let getContent = [];
            await this.knex(this.tableName).select("*").then((rows) => {
                let rowsarr = rows;
                rowsarr.map(row => getContent.push(JSON.parse(JSON.stringify(row))));
            });
            if (getContent == '') {
                getContent = '[]';
            }
            let prevContent = getContent;
            // Variable to check if the ID exists in the list
            let IDwasFound = 0;
            for (const i in prevContent) {
                if (prevContent[i].id == productId) {
                    IDwasFound = 1;
                    prevContent[i] = { id: parseInt(productId), ...product};
                }
            }
            // Throw error if ID was not found
            if (IDwasFound == 0) throw 'ID was not found';
            //KNEX
            await this.knex(this.tableName).where({id:productId}).update({...product});
            console.log('Escritura exitosa!');
            
            return { id: parseInt(productId), ...product}
        }
        catch(err){
            throw new Error(`${err}`)
        }
    }

    async getById(num) {
        try{
            let getContent = [];
            await this.knex(this.tableName).select("*").then((rows) => {
                let rowsarr = rows;
                rowsarr.map(row => getContent.push(JSON.parse(JSON.stringify(row))));
            });
            const content = getContent; 
            // Variable to check if the ID exists in the list
            let IDwasFound = 0;
            for (const i in content) {
                if (content[i].id == num) {
                    IDwasFound = 1;
                    
                    return content[i]
                }
            }
            // Throw error if ID was not found
            if (IDwasFound == 0) throw 'ID does not exist!'
        }
        catch(err){
            throw new Error(`${err}`)
        }
    }

    async getAll() {
        try{
            let getContent = [];
            await this.knex(this.tableName).select("*").then((rows) => {
                let rowsarr = rows;
                rowsarr.map(row => getContent.push(JSON.parse(JSON.stringify(row))));
            });
            // const content = JSON.parse(getContent); 
            
            return getContent
        }
        catch(err){
            throw new Error(`${err}`)
        }
    }

    async deleteById(num) {
        try{
            let getContent = [];
            await this.knex(this.tableName).select("*").then((rows) => {
                let rowsarr = rows;
                rowsarr.map(row => getContent.push(JSON.parse(JSON.stringify(row))));
            });
            const prevContent = getContent; 
            const newContent = [];
            // Variable to check if the ID exists in the list
            let IDwasFound = 0;
            for (let i = 0; i < prevContent.length; i++) {
                if (prevContent[i].id != num) {
                    newContent.push(prevContent[i]);
                } 
                else {
                    if (prevContent[i].id == num) {
                        IDwasFound = 1;
                    }
                }
            }
            // Throw error if ID was not found
            if (IDwasFound == 0) throw 'ID does not exist!';
            await this.knex(this.tableName).where('id', '=', num).del();
            console.log('Escritura exitosa!');
            
        }
        catch(err){
            throw new Error(`${err}`)
        }
    }

    async deleteAll() {
        try {
            await this.knex(this.tableName).del();
            console.log('Escritura exitosa!')
            
        } catch (err) {
            throw new Error(`${err}`) 
        }
    }
}

module.exports = Products;