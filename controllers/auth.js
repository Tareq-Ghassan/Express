const User = require('../models/user');
const bcrypt= require('bcryptjs');


exports.getLoginPage = (req, res, next) => {
  let message =req.flash('error')
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/login',{
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt.compare(req.body.password, user.password)
      .then(doMatch=>{
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err)=>{
            console.log(err);
            res.redirect('/');
          })
        }
        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');
      }).catch(error => {
        console.log(error);
        res.redirect('/login');
      })
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};

exports.getSignup = (req, res, next) => {
  let message =req.flash('error')
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  email = req.body.email;
  password = req.body.password;
  confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
  .then(user => {
    if (user) {
      req.flash('error', 'Email already exists.');
      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12)
    .then(hashPassword =>{
      return new User({
        email: email,
        password: hashPassword,
        cart:{
          items: []
        }
      }).save();
    }).then(result => {
      res.redirect('/login');
    });
  }).catch(error => {
    console.log(error);
    next(error);
  });
  

};

exports.postLogout= (req, res, next) =>{
  req.session.destroy(()=>{
    res.redirect('/');
  });
}
