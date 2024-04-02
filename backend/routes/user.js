const express = require("express")
const z = require('zod');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { user } = require("../db");
const JWT_SECRET = require("../config");
const { authMiddleware } = require("../middleware");

const signupschema = z.object({
    username: z.string().email(),
    password: z.string().min(8),
    firstname: z.string().min(2),
    lastname: z.string().min(2)
})

router.post("/signup", async(req,res)=>{
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

router.post("/signin",async(req,res)=>{
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

const updatebody = z.object({
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional()

})

router.put('/',authMiddleware,async(req,res)=>{
    const parsedbody = req.body
    const {success} = updatebody.safeParse(parsedbody)
    if(!success){
        res.send(411).json({
            msg:"error while updating information"
        })
        
    }
   await user.updateOne({_id:req.userID},parsedbody)

    res.json({
        msg: "Updated succesfully"
    })

})

router.get('/bulk',async(req,res)=>{
    const filter = req.query.filter || "";
    const users = await user.find({
        $or:[{
            firstname:{
                $regex:filter
            }
        },{
            lastname:{
                $regex:filter
            }
        }]
    })
    res.json({
        User : users.map(User=>({
            username:user.username,
            firstname:user.firstname,
            lastname:user.lastname,
            _id:user._id
        }))
    })
})



module.exports = router;