const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    restToken: String,
    restTokenExpiration: Date,
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
    }
})
userSchema.methods.addToCart = function (product) {
    if (!this.cart) {
        this.cart = { items: [] };
    }
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    });
    let newQuantity = 1;
    const updatedCartItems = this.cart.items.slice();
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems,
    }
    this.cart = updatedCart;
    return this.save()
}

userSchema.methods.deleteCartItem = function (id) {
    const updatedCartItems = this.cart.items.filter(i => i.productId.toString() !== id.toString());
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema); 