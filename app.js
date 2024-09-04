const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const userController = require('./controllers/user');
const sequelize = require('./helper/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userController.getUser(User))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
});
User.hasMany(Product);
User.hasOne(Cart)
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through: OrderItem});
Product.belongsToMany(Order,{through: OrderItem});


sequelize.sync()
    .then(() => {
        return User.findByPk(514634560);
    }).then(user=>{
        if(!user){
          return User.create({
            name: 'Tareq',
            email: 'tareq@gmail.com'
          })  
        }
        return Promise.resolve(user);
    })
    .then(user =>{
        console.log('Database synced successfully');
        return user.getCart().then(cart => {
            if (!cart) {
                return user.createCart();
            }
            return cart;
        });
    })
    .then(cart =>{
        app.listen(3000);
    })
    .catch(error=>{
        console.error('Failed to sync database:', error);
    });

app.use(errorController.handle500);
