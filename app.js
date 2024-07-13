const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');


mongoose.connect("mongodb://127.0.0.1:27017/fashionDB",{
   // useNewUrlParser:true,
    // useUnifiedTopology:true
    // useCreateIndex:true
}).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("no connection",e);
})


// Initialize Express app
const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/fashionDB'
      })}));



// Middleware to make session data available to all views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});


// Models
const User = require('./models/users');
const Product = require('./models/products');
const Cart = require('./models/carts');

// Routes
app.use('/', require('./routes/index'));
app.use('/login', require('./routes/user'));
app.use('/user', require('./routes/user'));
app.use('/product', require('./routes/product'));


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
