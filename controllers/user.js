
exports.getUser = (User) => {
   return (req, res, next) => {
    User.findById("66e03a194b601683d920c151")
            .then(user =>{
                req.user = user
                next();
            })
            .catch(error=>{
                console.error(error);
                next(error);
            });
    }
}
