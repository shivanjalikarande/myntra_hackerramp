const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Cart = require('../models/carts');
const Product = require('../models/products');

// Register route

router.get('/signup', async (req, res) => {
    res.render('signup');
})

// Login form route
router.get('/login', (req, res) => {
    res.render('login');
});

// Register route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newCart = new Cart({ products: [], sharedBy: [] });
    await newCart.save();
    const newUser = new User({ username, password, personalCart: newCart._id });
    await newUser.save();
    req.session.userId = newUser._id;
    const updatedOwnerOfPersonalCart = await Cart.findByIdAndUpdate(newCart._id ,{$push: {sharedBy: newUser._id } } ,{new:true }  );
    res.render("login");
});

// Login form route
router.get('/register', (req, res) => {
    res.render('register');
});

// Login route
router.post('/login', async (req, res) => {
    const username  = req.body.username;
    const password=req.body.password;
    const user = await User.findOne({ username:username, password:password });
  
    if (user) {
        req.session.userId = user._id;
        res.redirect("/");
       
    } else {
        res.render("signup")
       
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.post('/createCart', async (req,res)=>{
    const currUser = req.session.userId;
    const cartName=req.body.cartName;
    try{
        const newCart = new Cart({ products: [], sharedBy: [currUser] , shared : true , name: cartName}  );
        await newCart.save();
        const updatedUser = await User.findByIdAndUpdate(currUser,{$push: {sharedCarts: newCart._id } } ,{new:true }  );
        res.redirect("profile");
    } catch(error){
        if(error.code==11000){
            res.redirect("/");
        }
    }

})

router.post('/joinCart',async (req,res)=>{
    // console.log(req.body);
    const cartId = req.body.cartId;
    const user = req.session.userId;
    try{
        const updatedUser = await User.findByIdAndUpdate(user,{$push: {sharedCarts: cartId } } ,{new:true }  );
        const updatedCart = await Cart.findByIdAndUpdate(cartId,{$push: {sharedBy: user}} , {new:true} );
        res.redirect("profile")
    } catch(error){
        res.redirect("/");
    }
   
})


router.post("/profile",async (req,res)=>{
    const currUser=req.session.userId;
    const user= await User.findById(currUser);
    const sharedCarts = user.sharedCarts;
    const sharedCartIds=sharedCarts.map(id=>id.toString());
    const cartNames=[];
    const users=[];
    for(cartId of sharedCartIds){
        const members = [];
        const cart= await Cart.findById(cartId);    
        if(cart.shared==true){
            cartNames.push(cart);
            const array = cart.sharedBy.map(id=>id.toString());
           
            for(id of array){
                const mem = await User.findById(id);
               
                members.push(mem.username);
              
            }
            users.push(members);
        }
        
    }
    res.render("profile.ejs",{name:user.username, sharedCarts: cartNames, member: users, i:0});
})

router.post("/shopping",(req,res)=>{
    res.redirect("/");
})

router.get("/profile",async (req,res)=>{
    const currUser=req.session.userId;
    const user= await User.findById(currUser);
    const sharedCarts = user.sharedCarts;
    const sharedCartIds=sharedCarts.map(id=>id.toString());
    const cartNames=[];
    var users=[];
    for(cartId of sharedCartIds){
        var members = [];
        const cart= await Cart.findById(cartId);    
        if(cart.shared==true){
            cartNames.push(cart);
            const array = cart.sharedBy.map(id=>id.toString());
           
            for(id of array){
                const mem = await User.findById(id);
               
                members.push(mem.username);
               
            }
            users.push(members);
        }
    }
  
    res.render("profile.ejs",{name:user.username, sharedCarts: cartNames, member: users,i:0});
})


router.get("/cart", async (req,res)=>{
    const currUser=req.session.userId;
    const user= await User.findById(currUser);
    const personalCartId = user.personalCart.toString();
    
    const cart = await Cart.findById(personalCartId);
    const productIds = cart.products.map(id=>id.toString());
    const quantity = cart.quantity;
    
    const products= [];
    for(p of productIds){
        const pr=await Product.findById(p);
        products.push(pr);
    }
    const sharedCarts = user.sharedCarts;
        const sharedCartIds=sharedCarts.map(id=>id.toString());
        const cartNames=[];
        for(cartId of sharedCartIds){
            const cart= await Cart.findById(cartId);
           
            if(cart.shared==true){
                cartNames.push(cart);
            }
        }
        console.log(quantity);
    res.render("cart",{cartItems:products,quantity:quantity,i:0,shared:cartNames});
    
})

router.post("/cart/shared",async (req,res)=>{
    const products = await Product.find();
    const currUser = req.session.userId;
    const user = await User.findById(currUser);
    const cart = await Cart.findById(req.body.sharedCartId);
    // console.log(req.body.sharedCartId);
    if(user == null){
        res.render('index',{products:products , shared:null});
    }

    else{
        const name=cart.name;
        const cartId=cart._id;
        const cartProdIds = cart.products;
        const cartProd=cartProdIds.map(id=>id.toString());
        const cartItems=[];
        const quantity=cart.quantity;
        for(prodId of cartProd){
            const product= await Product.findById(prodId);
                cartItems.push(product); 
        }
        console.log(quantity);
        res.render('shared',{cartItems:cartItems,quantity:quantity,i:0,name:name,cartId:cartId});
    }
})


module.exports = router;