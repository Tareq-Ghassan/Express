const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};


exports.getProductDetails = (req,res,next) => {
  Product.fetchById(req.params.productId,
    product => {
      res.render('shop/product-detail',{
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
  });
}


exports.getCart = (req,res,next) => {
  res.render('shop/cart',{
    path: '/cart',
    pageTitle: 'Your Cart',
  })
};

exports.postCart = (req,res,next) => {
  req.params.productId;
  res.render('shop/cart',{
    path: '/cart',
    pageTitle: 'Your Cart',
  })
};

exports.getCheckout = (req,res,next) => {
  res.render('shop/checkout',{
    path: '/checkout',
    pageTitle: 'Checkout',
  })
};

exports.getOrders = (req,res,next)=>{
  res.render('shop/orders',{
    path: '/orders',
    pageTitle: 'Your Orders',
  })
};