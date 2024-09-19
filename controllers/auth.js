const User = require('../models/user');

exports.getLoginPage = (req, res, next) => {
    res.render('auth/login',{
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
  User.findById("66e03a194b601683d920c151")
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err)=>{
        if(err){
          console.log(err);
          next(err)
        }
        res.redirect('/');
      })
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};


exports.postLogout= (req, res, next) =>{
  req.session.destroy(()=>{
    res.redirect('/');
  });
}
