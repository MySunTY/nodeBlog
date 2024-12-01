const express = require("express");
const app = express();
const port = 3000;
const useLayOut = require("express-ejs-layouts");
const dbConnect = require("./db/dbConnect");
require("dotenv").config();
const methodOverride= require("method-override");


const cookieParser = require("cookie-parser");
require("dotenv").config();

dbConnect();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(useLayOut);
app.set("view engine", "ejs");
app.set("views","./views");
app.use(methodOverride("_method"));
app.use(cookieParser());

app.use("/",require("./routes/routers"));
app.use(express.static("public"));





app.listen(port,()=>{
    console.log(`Server Start At : Number ${port}`);
})