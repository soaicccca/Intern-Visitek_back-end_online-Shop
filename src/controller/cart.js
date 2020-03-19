const Cart_Db = require('../models/cart');
const Products = require('../models/products');
const User = require('../models/user');
const jwt = require("jsonwebtoken");


function Cart(cart) {
    this.products = cart.products || [];
    this.totalPrice = cart.totalPrice || 0;
    this.add = function (product, id) {
        let temp_product = this.products.find(element => element.id == id);

        if (!temp_product) {
            let temp;
            Products.findOne({ _id: id }, (err, pro) => {
                temp = pro.price;
            });
            temp_product = { id: id, quantity: 1, price: temp }
            this.products.push(temp_product);
            this.totalPrice += temp_product.quantity * temp_product.price;

        } else {
            let index = this.products.indexOf(temp_product);
            ++temp_product.quantity;
            temp_product.date = Date.now;

            this.products.splice(index, 1, temp_product);
            this.totalPrice = this.products.reduce((a, b) => a + (b.price * b.quantity), 0);

        }
    }
    this.date = Date.now();
    this.getCart = () => {
        return this.products;
    }
};

function AddtoCart(req, res) {

    let id = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {})
    req.session.cart = cart;

    Products.findById(id, (err, product) => {
        if (product) {
            cart.add(product, product._id);
            req.session.cart = cart;
            jwt.verify(req.token, 'privatekey', (err, authdata) => {
                if (err) {
                    res.status(201).json({
                        message: " cart only save on session",
                    });
                } else {
                    let cart_db = new Cart_Db({
                        user: authdata._id,
                        products: req.session.cart.product,
                        totalPrice: req.session.cart.totalPrice,
                        date: new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    })
                    cart_db.save().then(val => {
                        res.status(201).json({
                            message: " cart save in database",
                            data: authdata
                        });
                    })
                }
            })
            // ------
        }
    })




}

function showCart(req, res) {

    jwt.verify(req.token, 'privatekey', (err, authdata) => {
        if (err) {
            if (!req.session.cart.products) {
                res.json({ status: 'cart is empty' });
            }
            res.json(req.session.cart.products)
        } else {
            Cart_Db.find({ user: authdata._id }, (err, doc) => {
                if (doc) {
                    if (!doc.products) {
                        res.json({ status: 'cart is empty' });
                    }
                    res.json({
                        userId: doc.user,
                        carts: doc.products
                    })
                }
            })
        }
    })

}



module.exports = {
    AddtoCart: AddtoCart,
    showCart: showCart,

}