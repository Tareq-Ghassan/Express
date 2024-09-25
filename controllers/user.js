
exports.getUser = (User) => {
   return (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
            .then(user =>{
                if(!user){
                    return next();
                }
                req.session.user = user;
                next();
            })
            .catch(error=>{
                console.error(error);
                next(error);
            });
    }
}
