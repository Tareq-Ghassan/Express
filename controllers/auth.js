exports.getLoginPage = (req, res, next) => {
  let isLoggedIn =req.get('Cookie').split('=')[1]
    res.render('auth/login',{
      pageTitle: 'Login',
      path: '/login',
      isAuthenticated: isLoggedIn
    });
};
exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'isLoggedIn=true;')
  res.redirect('/');
};

