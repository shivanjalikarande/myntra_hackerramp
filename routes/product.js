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
    
    user.personalCart.quantity.push(req.body.quantity);
    // console.log("quantity: "+req.body.quantity);
    await user.personalCart.save();

    res.redirect('/');
});

// Add product to shared cart
router.post('/add-to-shared-cart/:productId', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    else{
        const productId = req.params.productId;
        const cartId = req.body.sharedCartId;
        
        const cart = await Cart.findByIdAndUpdate(cartId, {$push: {products: productId , quantity: req.body.quantity}},{new:true});
        res.redirect('/');
    }
   
});

module.exports = router;