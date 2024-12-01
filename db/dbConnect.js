const mongoose = require("mongoose");
require("dotenv").config();
const asyncHandler = require("express-async-handler");

const dbConnect = asyncHandler(async()=>{
    await mongoose.connect(process.env.DB_CONNECT);
    console.log("DB CONNECTED");
})

module.exports= dbConnect;