const mongoose = require("mongoose");
const { number } = require("zod");
mongoose.connect("mongodb+srv://mnegi17:oufdFEsshh2bUHGT@cluster0.8n60td7.mongodb.net/Paytm", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const userschema = new mongoose.Schema({
    username : String,
    password : String,
    firstname : String ,
    lastname : String
})

const accountschema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const account = mongoose.model('account',accountschema)

const user = mongoose.model('user' , userschema)

module.exports = {user , account};
