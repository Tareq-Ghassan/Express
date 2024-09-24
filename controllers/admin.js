const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
      }, 
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
    userId: req.session.user,
  }).save()
  .then(() =>{
    res.redirect('/');
  })
  .catch(error => {
    console.error('Error creating product:', error);
    next(error); // Pass the error to the error-handling middleware
  }); 
}

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({
    _id: req.params.productId,
     userId: req.session.user._id
    })
    .then(result=>{
      console.log('Product deleted:', result);
      res.redirect('/admin/products');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
 Product.findById(req.params.productId)
    .then(product=>{
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product',{
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product, 
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        validationErrors: errors.array(),
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });

};

exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product',{
      pageTitle: 'Eddit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        _id: req.body.productId
      }, 
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById(req.body.productId)
  .then(product => {
    if (product.userId.toString() !== req.session.user._id.toString()) {
      return res.redirect('/');
    }
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.imageUrl = req.body.imageUrl;
    return product.save() 
    .then(result => {
      console.log('Product updated:', result);
      res.redirect('/');
    })
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
}

exports.getProducts = (req,res,next) =>{
    Product.find({userId: req.session.user._id})
      .then(products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
        });
      })
      .catch(error => {
        console.log(error);
        next(error);
      });
};