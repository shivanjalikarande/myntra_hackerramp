const express = require('express');
const router = express.Router();
const Product = require('../models/products');

// Home route
router.get('/', async (req, res) => {
    const products = await Product.find();
    
    res.render('index',{products:products});
});

module.exports = router;
