const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    personalCart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    sharedCarts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Cart'}],
}   
);

module.exports = mongoose.model('User', userSchema);
