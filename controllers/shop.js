const { inc } = require('semver');
const Product = require('../models/product');
const Order = require('../models/order');
const mongoose = require('mongoose');

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(error => {
    console.log(error);
    next(error);
    });
}

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};


exports.getProductDetails = (req,res,next) => {
  Product.findById(req.params.productId)
    .then(product => {
      res.render('shop/product-detail',{
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}


exports.getCart = (req,res,next) => {
  req.user.populate('cart.items.productId')
  .then(user => {
      res.render('shop/cart',{
        path: '/cart',
        pageTitle: 'Your Cart',
        products:user.cart.items
      })
    })
    .catch(error => {
    console.log(error);
    next(error);
  });
};

exports.postCart = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {  
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};


exports.deleteCartItem = (req,res,next) => {
  req.user.deleteCartItem(req.body.productId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}

exports.postOrder = (req,res,next) => {
  req.user.populate('cart.items.productId')
  .then(user => {
    const order=new Order({
      user:{
        username: user.username,
        userId: user
      },
      products:  user.cart.items.map(i => {
        return {
          quantity: i.quantity,
          product: {
            ...i.productId._doc
          }
        };
      })
    })
   return order.save()
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(result => {
    res.redirect('/orders');
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
}

exports.getOrders = (req,res,next)=>{
  Order.find({'user.userId' : req.user._id})
    .then(orders => {
      console.log(orders);

      res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};