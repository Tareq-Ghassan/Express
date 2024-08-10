const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
  );

module.exports = class Cart{
    static addProduct(id , productPrice){
        fs.readFile(p, (error,fileContent)=>{
            let cart = {products: [], totalPrice: 0};
            if(!error){
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(p=>p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct={...existingProduct}
                updatedProduct.qty=updatedProduct.qty+1;
                cart.products= [...cart.products];
                cart.products[existingProductIndex]= updatedProduct
            }else{
                updatedProduct={id:id,qty:1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p,JSON.stringify(cart),err=>{
                console.log(err);
            })
        })
    }
    
    static delete(id,productPrice){
        fs.readFile(p, (error,fileContent)=>{
            if(error){
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};
            const product= updatedCart.products.find(p=>p.id === id);
            if(!product){
                return;
            }
            const productQty= product.qty;
            updatedCart.products = updatedCart.products.filter(p=>p.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);
            fs.writeFile(p,JSON.stringify(updatedCart),err=>{
                console.log(err);
            })
        });
    }

    static getCart(cb){
        fs.readFile(p, (error,fileContent)=>{
            const cart= JSON.parse(fileContent);
            if(error){
             return cb(null);
            }
            cb(cart);
        });
    }
}