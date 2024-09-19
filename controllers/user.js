
exports.getUser = (User) => {
   return (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
            .then(user =>{
                req.user = user;
                next();
            })
            .catch(error=>{
                console.error(error);
                next(error);
            });
    }
}
