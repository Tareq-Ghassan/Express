const mongodb = require('mongodb');
const getDB = require('../helper/database').getDB;


class User{
    constructor(username,email,cart,id){
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id= id;
    }
    save() {
        const db = getDB();
        // Return the promise here so it can be handled by the caller
        return db.collection('users').insertOne(this)
            .then(result => {
                console.log('User saved:', result);
                return result;
            })
            .catch(error => {
                console.error('Failed to save user:', error);
                throw error;  // Re-throw to allow caller to handle
            });
    }
    
    addToCart(product){
        if (!this.cart) {
            this.cart = { items: [] };
        }
        const cartProductIndex = this.cart.items.findIndex(cp =>{
           return cp.productId.toString() === product._id.toString()
        }); 
        let newQuantity=1;
        const updatedCartItems = this.cart.items.slice();

        if(cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity= newQuantity;
        }else{
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedCart = {
            items: updatedCartItems,
        }

        const db =getDB();
        db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        )
    }

    getCart(){
        const db =getDB();
        const productIds = this.cart.items.map(i => i.productId);
        return db.collection('products').find({_id: {
            $in: productIds
        }}).toArray()
        .then(products =>{
            return products.map(p =>{
                return {
                    ...p,
                    quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
                }
            })
        })
        .catch(error =>{
            console.log(error);
            next(error);
        });
    }

    deleteCartItem(id){
        const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== id.toString());
        const updatedCart = {
            items: updatedCartItems,
        }
        const db =getDB();
       return db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        )
    }

    addOrder(){
        const db = getDB();
        return this.getCart().
        then(products =>{
            const order ={
                items: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    username: this.username,
                    email: this.email
                }
            }
            return db.collection('orders').insertOne(order)
        })
        .then(result=>{
            this.cart ={
                items: []
            }
          return  db.collection('users').updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { 
                    cart:{
                            items: []
                        }
                    } 
                }
            )
        })
    }

    getOrders(){
        const db = getDB();
        return db.collection('orders').find({
            'user._id': new mongodb.ObjectId(this._id)
        }).toArray()
    }

    static findById(id) {
        const db = getDB();
        // Correctly return the promise from findById
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })  // Use findOne instead of find().next()
            .then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
                return user;
            })
            .catch(error => {
                console.error('Failed to find user:', error);
                throw error;  // Re-throw to allow caller to handle
            });
    }
}

module.exports = User