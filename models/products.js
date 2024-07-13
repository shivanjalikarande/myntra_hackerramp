const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    img: String},
    {
        collection: 'products',
    }
    
);

module.exports = mongoose.model('Product', productSchema);
