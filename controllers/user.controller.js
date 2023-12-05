

const register = async(req,res) =>{
    return res.status(200).json({success:true, msg: "Register route"})
}


module.exports = {register}