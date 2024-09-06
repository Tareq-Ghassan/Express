const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
  new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageUrl: 'https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png',
    userId: req.user._id
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
  Product.deleteProduct(req.body.productId)
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
 Product.findByPk(req.params.productId)
    .then(product=>{
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product',{
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });

};

exports.postEditProduct = (req, res, next) => {
  const title= req.body.title;
  const imageUrl= req.body.imageUrl;
  const price= req.body.price;
  const description= req.body.description;
  return new Product({
    title:title,
    imageUrl:imageUrl,
    price:price,
    description:description
  },
  req.body.productId
  ).save()
    .then(result => {
      console.log('Product updated:', result);
      res.redirect('/');
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
}

exports.getProducts = (req,res,next) =>{
  Product.fetchAll()
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