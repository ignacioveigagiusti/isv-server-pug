const fs = require('fs');

class Container {
    constructor(fileToWork){
        this.fileToWork = fileToWork
    }
    
    async save(product) {
        try{
            let getContent = await fs.promises.readFile(`${this.fileToWork}`, 'utf8');
            if (getContent == '') {
                getContent = '[]';
            }
            const prevContent = JSON.parse(getContent); 
            let indexArray = [];
            for (const i in prevContent) {
                indexArray.push(prevContent[i].id);
            }
            let newID = indexArray.length + 1;
            if (indexArray.length > 0) {
                indexArray = indexArray.sort((a,b) => a - b )
                for (let i = 0; i < indexArray.length; i++) {
                    if ((indexArray[i]-i) != 1){
                        newID = i+1;
                    }
                }
            }
            const newProduct = {id: newID, ...product};
            let newContent = prevContent
            newContent.push(newProduct);
            await fs.promises.writeFile(`${this.fileToWork}`, JSON.stringify(newContent));
            console.log('Escritura exitosa!');
        }
        catch(err){
            throw new Error(`Error: ${err}`)
        }
    }
    async getById(num) {
        try{
            const getContent = await fs.promises.readFile(`${this.fileToWork}`, 'utf8');
            const content = JSON.parse(getContent); 
            return content[num-1]
        }
        catch(err){
            throw new Error(`Error: ${err}`)
        }
    }
    async getAll() {
        try{
            const getContent = await fs.promises.readFile(`${this.fileToWork}`,);
            const content = JSON.parse(getContent); 
            return content
        }
        catch(err){
            throw new Error(`Error: ${err}`)
        }
    }
    async deleteById(num) {
        try{
            const getContent = await fs.promises.readFile(`${this.fileToWork}`, 'utf-8');
            const prevContent = JSON.parse(getContent); 
            const newContent = [];
            for (let i = 0; i < prevContent.length; i++) {
                if (prevContent[i].id !== num) {
                    newContent.push(prevContent[i]);
                }
            }
            await fs.promises.writeFile(`${this.fileToWork}`, JSON.stringify(newContent))
            console.log('Escritura exitosa!')
        }
        catch(err){
            throw new Error(`Error: ${err}`)
        }
    }
    async deleteAll() {
        try {
            await fs.promises.writeFile(`${this.fileToWork}`, '[]')
            console.log('Escritura exitosa!')
        } catch (err) {
            throw new Error(`Error: ${err}`) 
        }

    }
}

module.exports = Container