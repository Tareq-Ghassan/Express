require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose')

const errorController = require('./controllers/error');
const userController = require('./controllers/user');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userController.getUser(User))

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


mongoose.connect(process.env.MONGO_URI)
.then(result => {
    app.listen(process.env.PORT);
}).catch(error=>{
    console.log(error);
    next(error);
})

app.use(errorController.handle500);