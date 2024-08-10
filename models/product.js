const crypto = require("crypto");
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, {title,imageUrl,description,price}) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if(this.id){
        const existingProductIndex = products.findIndex(p=> p.id == this.id);
        if(existingProductIndex>=0){
          const updatedProduct = {...products};
          updatedProduct[existingProductIndex]= this;
          fs.writeFile(p, JSON.stringify(updatedProduct), err => {
            console.log(err);
          });
        }else{
          console.log('Product not found');
          return;
        }
      }else{
        this.id = crypto.randomUUID();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static fetchById(id , cb) {
    getProductsFromFile(products=>{
      cb(products.find(p=>p.id==id));
    });
  }
};
