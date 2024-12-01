const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main";
const startLayout = "../views/layouts/start";
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const jwtSecret= process.env.JWT_SECRET;


//get 첫화면, 로그인화면
router.get("/",(req,res)=>{
    const titles = {
        title: "로그인화면"
    };
    res.render("index", {titles,layout:startLayout});
});

//get 회원가입 화면
router.get("/register",(req,res)=>{
    const titles = {
        title: "회원가입페이지"
    };
    res.render("register",{titles, layout:startLayout});
});

//post 회원가입처리

router.post("/register",asyncHandler(async(req,res)=>{
    const {username, password, password2, email} = req.body;
    if(!username){
        const message ={
            msg :"아이디를 입력해주세요!!"
        }
        return res.status(400).json({message : "사용자를 찾을 수 없습니다"});
    }
    if(password != password2){
        return res.status(400).json({message : "비밀번호를 확인해주세요"});
    }
    if(!email){
        return res.status(400).json({message : "이메일을 입력해주세요"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username : username,
        password : hashedPassword,
        email : email,
    });
    if(user){
        return res.redirect("/");
    }

}));

//POST 로그인처리 -> 메인화면으로이동
router.post("/main",asyncHandler(async(req,res)=>{
    const titles={
        title: "메인페이지"
    };
    const {username, password} = req.body;
    const user = await User.findOne({username: username});
    if(!user){
        return res.json({message: "회원가입이 안된 아이디입니다"});
    }
    const checkPassword = await bcrypt.compare(password,user.password);
    if(checkPassword){
        const token = jwt.sign({id : user._id},jwtSecret);
        res.cookie("token",token ,{httpOnly : true});

        return res.render("home",{titles, layout:mainLayout});
    }else{
        return res.status(400).json({message : "비밀번호가 일치하지 않습니다"});
    }
}));

router.get("/main",(req,res)=>{
    const titles={
        title: "메인페이지"
    }
    res.render("home",{titles,layout:mainLayout});
});

router.get("/showPost",asyncHandler(async(req,res)=>{
    const titles={
        title:"Show Post"
    };
    const post = await Post.find();
    res.render("showPost",{titles,post,layout:mainLayout});
}));

router.get("/writePost",(req,res)=>{
    const titles={
        title:"Write Post"
    }
    res.render("writePost",{titles,layout:mainLayout});
})

router.post("/writePost",asyncHandler(async(req,res)=>{
    const {title, content} = req.body;
    const post = await Post.create({
        title: title, content: content
    });
    if(!post){
        return res.redirect("/writePost");
    }else{
        return res.redirect("/showPost");
    }
}));

router.get("/updateOne/:id",asyncHandler(async(req,res)=>{
    const titles={
        title:"Update Page"
    };
    const post = await Post.findOne({_id: req.params.id});
    res.render("updateOne",{titles, post, layout:mainLayout});
}));

router.get("/showOne/:id",asyncHandler(async(req,res)=>{
    const titles={
        title: "게시글 보기"
    };
    const post = await Post.findOne({_id: req.params.id});
    res.render("showOne",{titles, post, layout:mainLayout});
}))

router.put("/updateOne/:id", asyncHandler(async(req,res)=>{
    await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        content : req.body.content,
        createdTime : Date.now()
    });
    res.redirect("/showPost");
}));

router.delete("/deleteOne/:id",asyncHandler(async(req,res)=>{
    await Post.deleteOne({_id:req.params.id});
    res.redirect("/showPost");
    
}));

router.get("/logout", (req,res)=>{
    res.clearCookie("token");
    res.redirect("/");
})

module.exports = router;
