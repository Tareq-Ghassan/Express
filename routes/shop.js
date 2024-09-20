const express = require('express');

const shopController = require('../controllers/shop')

const isAuth = require('../middleware/is-auth');


const router = express.Router();

// second midleware
router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/products/:productId',shopController.getProductDetails);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.deleteCartItem);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postOrder);

module.exports = router;
