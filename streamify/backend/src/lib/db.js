const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const connectdb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }   catch(err){
        console.log("MongoDB connection failed", err);
        process.exit(1); // 1 means failure
    }
}

module.exports = connectdb;