const express = require('express');
const router = express.Router();
const user_ctr = require('../controller/user')
const cart_ctr = require('../controller/cart');
const products_ctr = require('../controller/products');
const JWT = require('../middlewares/Jwt');
const upload = require('../middlewares/upload');
const CheckAdmin = require('../middlewares/isAdmin');
const checkCart = require('../middlewares/checkCart');
const checkCart15day = require('../middlewares/checkCart');

router.get('/', checkCart.checkCart15day);
router.route('/signUp').post(user_ctr.signUp); //ok
router.get('/confirm/:id', user_ctr.checkedMail);//oke

router.route('/signin').post(checkCart15day.checkCart15day, user_ctr.signIn);//oke
router.post('/changePassword', JWT.verifiToken, user_ctr.changePassword);

router.post('/addProductToCart/:id', cart_ctr.AddtoCart);//oke
router.get('/showCart', cart_ctr.showCart);// oke
router.get('/saveCart', JWT.verifiToken, cart_ctr.saveCart);// oke

router.route('/products')
    .get(products_ctr.GetAllProducts)//oke
router.route('/createProduct')
    .post(JWT.verifiToken, CheckAdmin.IsAdmin, products_ctr.CreateProduct);//oke

router.route('/products/:id')
    .get(products_ctr.getProduct)//oke
    .delete(JWT.verifiToken, CheckAdmin.IsAdmin, products_ctr.DeleteProduct)//oke
    .patch(JWT.verifiToken, CheckAdmin.IsAdmin, upload.upload_img, products_ctr.updateProduct);//oke

module.exports = router;
