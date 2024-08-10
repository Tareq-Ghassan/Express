const Product = require('../models/product');
const Cart = require('../models/cart');

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
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(product of products){
        const cartProductData= cart.products.find(p=>p.id === product.id)
        if(cartProductData){
          cartProducts.push({
            productData:product,
            qty:cartProductData
          });
        }
      }
      res.render('shop/cart',{
        path: '/cart',
        pageTitle: 'Your Cart',
        products:cartProducts
      })
    });
  });

};

exports.postCart = (req,res,next) => {
  Product.fetchById(req.body.productId,
    product => {
      Cart.addProduct( product.id, product.price);
    });
    res.redirect('/cart');
};


exports.deleteCartItem = (req,res,next) => {
  const productPrice = Product.fetchById(req.body.productId, product => {
    Cart.delete(req.body.productId,  product.price);
    res.redirect('/cart');
  });
}

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