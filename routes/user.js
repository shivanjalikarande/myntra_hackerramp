const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Cart = require('../models/carts');
const Product = require('../models/products');

// Register route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newCart = new Cart({ products: [], sharedBy: [] });
    await newCart.save();
    const newUser = new User({ username, password, personalCart: newCart._id });
    await newUser.save();
    req.session.userId = newUser._id;
    const updatedOwnerOfPersonalCart = await Cart.findByIdAndUpdate(newCart._id ,{$push: {sharedBy: newUser._id } } ,{new:true }  );
    
   
    res.redirect('/');
});

// Login form route
router.get('/login', (req, res) => {
    res.render('login');
});

// Login route
router.post('/login', async (req, res) => {
    const username  = req.body.username;
    const password=req.body.password;
    const user = await User.findOne({ username:username, password:password });
    console.log(user);
    if (user) {
        req.session.userId = user._id;
        res.redirect("/");
        // const products = await Product.find();
        // res.render('/index',{products:products});
    } else {
        res.redirect("/user/login");
        // res.render('login');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/createCart', async (req,res)=>{
    const currUser = req.session.userId;
    const newCart = new Cart({ products: [], sharedBy: [currUser] , shared : true}  );
    await newCart.save();
    try{
        const updatedUser = await User.findByIdAndUpdate(currUser,{$push: {sharedCarts: newCart._id } } ,{new:true }  );
        console.log(updatedUser);

    } catch(err){
        console.log(err.message);
    }
    

    
// console.log(req.session.userId);
    res.redirect("/");
})



module.exports = router;
