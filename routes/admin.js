const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// first midleware
router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.post('/edit-product', adminController.getEditProduct);

module.exports = router;