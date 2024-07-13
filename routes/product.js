const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const User = require('../models/users');
const Cart = require('../models/carts');

// Add product to personal cart
router.post('/add-to-personal-cart/:productId', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const productId = req.params.productId;
    const user = await User.findById(req.session.userId).populate('personalCart');
    user.personalCart.products.push(productId);
    await user.personalCart.save();
    res.redirect('/');
});

// Add product to shared cart
router.post('/add-to-shared-cart/:productId', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    const productId = req.params.productId;
    const cartId = req.body.cartId;
    const cart = await Cart.findById(cartId);
    cart.products.push(productId);
    await cart.save();
    res.redirect('/');
});

module.exports = router;
