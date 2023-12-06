const mongoose = require("mongoose");
const Admin = require("./models/admin.model");


const run = async() =>{
    try {
        // await mongoose.connect(process.env.MONGOURI)

        await Admin.deleteMany();    
        process.exit(1)
    } catch (error) {
        console.log(error)
        process.exit(1)        
    }
    
}

module.exports = run;