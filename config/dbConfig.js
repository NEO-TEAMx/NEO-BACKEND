const mongoose = require('mongoose');


const connectDB = async(uri) =>{
    try {
        mongoose.connect(uri);  
        console.log(`Database connected!`)      
    } catch (error) {
        console.log(error)
    }

};

module.exports = connectDB;