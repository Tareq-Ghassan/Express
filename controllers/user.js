exports.getUser = (User) => {
   return (req, res, next) => {
        User.findByPk(514634560)
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
