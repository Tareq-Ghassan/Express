const ObjectId = require('mongodb').ObjectId;
const findById = require('../models/user').findById;
const User = require('../models/user');

exports.getUser = () => {
   return (req, res, next) => {
        findById(new ObjectId("66db03da90289b005a31270d"))
            .then(user =>{
                req.user =new User(user.username,user.email,user.cart,user._id);
                next();
            })
            .catch(error=>{
                console.error(error);
                next(error);
            });
    }
}
