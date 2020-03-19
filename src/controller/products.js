const Product = require('../models/products')
const jwt = require("jsonwebtoken");
const fs = require('fs');

function GetAllProducts(req, res) {
    Product.find({}, (err, products) => {
        res.json({ data: products });
    })
}

function CreateProduct(req, res) {
    jwt.verify(req.token, 'privatekey', (err, authdata) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let img;
            if (!req.file) {
                img = "no-image"
            } else {
                var old_path = req.file.path;
                var new_path = req.file.destination + req.file.originalname;
                fs.rename(old_path, new_path, err => {
                    if (err) throw err;
                });
                img = req.file.originalname
            }

            let data = {
                sku: req.body.sku,
                productName: req.body.productName,
                category: req.body.category,
                price: req.body.price,
                discount: req.body.discount,
                image: img
            };

            let product = new Product(data)
            product.save().then(val => {
                res.json({
                    status: "succses",
                    data: val
                })
            });
        }
    })


}

function DeleteProduct(req, res) {
    jwt.verify(req.token, 'privatekey', (err, authdata) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let id = req.params.id;
            Product.deleteOne({ _id: id }, (err) => {
                res.json({
                    'deleted': true
                })
            })
        }
    })

}

function updateProduct(req, res) {
    jwt.verify(req.token, 'privatekey', (err, authdata) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let id = req.params.id;
            Product.updateOne({ _id: id }, req.body, (err, raw) => {
                res.json({ raw });
            })
        }
    })

}

function getProduct(req, res) {
    let id = req.params.id;
    console.log(id)
    Product.findOne({ _id: id }, (err, data) => {
        res.json(data);
    })
}

module.exports = {
    getProduct: getProduct,
    GetAllProducts: GetAllProducts,
    DeleteProduct: DeleteProduct,
    updateProduct: updateProduct,
    CreateProduct: CreateProduct
}