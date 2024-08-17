const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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
  Product.findByPk(req.params.productId)
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
  Product.findByPk(req.body.productId,)
    .then(product => {
      Cart.addProduct( product[0].id, product[0].price);
      res.redirect('/cart');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
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