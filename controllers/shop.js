require('dotenv').config();
const { inc } = require('semver');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_KEY);


const Product = require('../models/product');
const Order = require('../models/order');
const mongoose = require('mongoose');

const ITEMS_PER_PAGE = 1;


exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    }
    )
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    }
    )
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};


exports.getProductDetails = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => {
      res.render('shop/product-detail', {
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


exports.getCart = (req, res, next) => {
  req.session.user.populate('cart.items.productId')
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
      })
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.session.user.populate('cart.items.productId')
    .then(user => {
      products = user.cart.items;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',  // Add this line to specify one-time payment mode
        line_items: products.map(p => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
              unit_amount: p.productId.price * 100, // Amount is in cents
            },
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
        sessionId: session.id
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};



exports.getCheckoutSuccess = (req, res, next) => {
  req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.session.user.email,
          userId: req.session.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.session.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postCart = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      return req.session.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};


exports.deleteCartItem = (req, res, next) => {
  req.session.user.deleteCartItem(req.body.productId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}

exports.postOrder = (req, res, next) => {
  req.session.user.populate('cart.items.productId')
    .then(user => {
      const order = new Order({
        user: {
          email: user.email,
          userId: user
        },
        products: user.cart.items.map(i => {
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
      return req.session.user.clearCart();
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': new mongoose.Types.ObjectId(req.session.user._id) })
    .then(orders => {
      res.render('shop/orders', {
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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.session.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('---------------------------------');
      order.products.forEach(prod => {
        pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price)
      });
      pdfDoc.text('---------------------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
      });
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}