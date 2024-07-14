const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    sharedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shared: { type: Boolean, default: false},
    name : { type: String , default: null,unique:false } ,
    quantity: [{ type: Number  }],
}
);

module.exports = mongoose.model('Cart', cartSchema);