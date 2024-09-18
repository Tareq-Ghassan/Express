const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated: req.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
  new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
    userId: req.user,
    isAuthenticated: req.isLoggedIn
  }).save()
  .then(() =>{
    res.redirect('/',{
      isAuthenticated: req.isLoggedIn
    });
  })
  .catch(error => {
    console.error('Error creating product:', error);
    next(error); // Pass the error to the error-handling middleware
  }); 
}

exports.deleteProduct = (req, res, next) => {
  Product.findByIdAndDelete(req.body.productId)
    .then(result=>{
      console.log('Product deleted:', result);
      res.redirect('/admin/products',{
        isAuthenticated: req.isLoggedIn
      });
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
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });

};

exports.postEditProduct = (req, res, next) => {
  Product.findById(req.body.productId)
  .then(product => {
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.imageUrl = req.body.imageUrl;
    return product.save();
  })
  .then(result => {
    console.log('Product updated:', result);
    res.redirect('/',{
      isAuthenticated: req.isLoggedIn
    });
  })
  .catch(error => {
    console.log(error);
    next(error);
  });
}

exports.getProducts = (req,res,next) =>{
  Product.find()
      // .select('title price -_id')
      // .populate('userId')
      .then(products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
          isAuthenticated: req.isLoggedIn
        });
      })
      .catch(error => {
        console.log(error);
        next(error);
      });
};