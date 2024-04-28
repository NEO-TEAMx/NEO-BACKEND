const { BadRequestApiError } = require("../Errors");
const NL = require("../models/newsLetter");
const SendNewsLetterMail = require("../EmailFormats/newLetterEmail");

const subscribeNL = async(req,res) =>{
    
    const {email} = req.body;
    if(!email){
        throw new BadRequestApiError("Email is required")
    }
    
    const createNL = await NL.create({email});

    await SendNewsLetterMail({email:email})

    return res.status(201).json({success:true, msg: "successfully subscribed for newletter", createNL})

};

const allSubscribers =  async(req,res) =>{
    const alSubscribers = await NL.find({});
    return res.status(200).json({
        success:true,
        alSubscribers
    });
};

const unsubscribe = async(req,res) =>{
    const removeSubscription = await NL.find({email});
};


module.exports = {
    subscribeNL,
    unsubscribe,
    allSubscribers
}