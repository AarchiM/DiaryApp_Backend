require('dotenv').config();
const config = require("./config.json")

const mongoose = require('mongoose');
mongoose.connect(config.connenctionString)

const express = require("express");
const cors = require("cors");
const app = express();

const User = require("./models/user.model");
const jwt = require('jsonwebtoken');
const {authenticationToken} = require("./utilities.JS");

app.use(cors({
    origin:"*",
}))

const port = 4000;


app.get("/",(req,res)=>{
    res.send("API IS RUNNING....")
})

app.post("/create-account", async(req,res)=>{
    const {fullname, email, password} = req.body;

    if(!fullname){
        return res.status(400).json({error:true, message:"FullName is required"});
    }
    if(!email){
        return res.status(400).json({error:true, message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true, message:"Password is required"});
    }

    const isUser = await User.findOne({email:email});

    if(isUser) return res.status(400).json({error:true, message:"User Already Exist"});

    const user = new User ({
        fullname,
        email,
        password,
    })

    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : "30n",
    })

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registeration Successful"
    })

})

app.listen(port,()=>{
    console.log(`Server is running on port no ${port}`);
    
})

module.exports =  app;