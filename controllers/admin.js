const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    imageUrl:"https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png",
    //  req.body.imageUrl,
    price:req.body.price,
    description: req.body.description,
  });
  product.save();
  res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  res.render('admin/edit-product',{
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
  });
};

exports.getProducts = (req,res,next) =>{
    Product.fetchAll(products => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
        });
      });
};