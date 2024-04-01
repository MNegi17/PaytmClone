const express = require("express")
const z = require('zod');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { user } = require("../db");
const JWT_SECRET = require("../config");

const signupschema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
    firstname: z.string().min(2),
    lastname: z.string().min(2)
})

router.post("/api/v1/user/signup", async (req,res)=>{
    const body =  req.body;
    const {success} = signupschema.safeparse(body);
    if (!success){
        return res.status(200).json({
            msg: "Email already taken / Incorrect inputs"
        }) 
    }

    const User  = user.findone({
        username: body.username
    })
    
    if(User._id){
        return res.json({
            msg:"Email already taken / Incorrect inputs"
        })
    }
    const dbuser = await user.create(body)
    const token = jwt.sign({
        userID: dbuser._id
    },JWT_SECRET);
    res.json({
        msg : "User created successfully",
        token: token
    })
})


const signinschema = z.object({
    username: z.string().email(),
    password: z.string().min(8)
})

router.post("/api/v1/user/signin",async(req,res)=>{
    const body = req.body
    const {success} = signinschema.safeparse(body)
    if(!success){
        return res.json({
            msg : "Incorrect Inputs"
        })
    }
    const User = await user.findone({
        username:body.username
    })
    if(User){
        const token = jwt.sign({
            userID : User._id
        },JWT_SECRET)
        res.json({
            token : token
        })
        return;
    }
    res.status(411).json({
        msg:"error while logging in"
    })
})

module.exports = router;