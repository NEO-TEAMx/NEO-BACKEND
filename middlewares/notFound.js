const notFoundRoute = (req,res) => res.status(404).json({success:true, msg:'Route does not exist'});


module.exports = notFoundRoute;