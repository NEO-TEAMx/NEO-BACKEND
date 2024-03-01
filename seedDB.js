const connectDB = require("./config/dbConfig");
const Admin = require("./models/admin.model");
const User = require("./models/user.model");
const Withdrawal = require("./models/withDrawal.model");
const Deposit = require("./models/deposit.model");
const Utoken = require("./models/token.model/uToken");
const Token = require("./models/token.model/token");
const mongoose = require("mongoose")

const run = async() =>{
    try {
      await connectDB(process.env.MONGOURI)

      // await mongoose.connection.dropDatabase();

        
        // await connectDB(process.env.MONGOURI)
        // await Admin.deleteMany();   
        await User.deleteMany();
        // await Withdrawal.deleteMany();
        // await Deposit.deleteMany();
        // await Utoken.deleteMany();
        // await Token.deleteMany();
        console.log("success!!") 
        process.exit(0)
        
    } catch (error) {
        console.log(error)
        process.exit(1)        
    }
    
}

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      await Job.create(mockData);
      console.log('Success !!!');
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};

module.exports = run;