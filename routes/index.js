const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const User = require('../models/users');
const Cart = require('../models/carts');


// Home route
router.get('/', async (req, res) => {
    const products = await Product.find();
    const currUser = req.session.userId;
    const user = await User.findById(currUser);
    
    if(user ==null){
        res.render('index',{products:products , shared:null});
    }
    else{
        const sharedCarts = user.sharedCarts;
        const sharedCartIds=sharedCarts.map(id=>id.toString());
        const cartNames=[];
        for(cartId of sharedCartIds){
            const cart= await Cart.findById(cartId);
           
            if(cart.shared == true){
                cartNames.push(cart);
            }
        }
    
    
    res.render('index',{products:products, shared:cartNames});
    }
    
    
});

module.exports = router;