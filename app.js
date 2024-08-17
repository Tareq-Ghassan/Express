const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const userController = require('./controllers/user');
const sequelize = require('./helper/database');
const Product = require('./models/product');
const User = require('./models/user');

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
        console.log(user);
        app.listen(3000);
    })
    .catch(error=>{
        console.error('Failed to sync database:', error);
    });

app.use(errorController.handle500);
