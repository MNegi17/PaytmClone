const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://mnegi17:oufdFEsshh2bUHGT@cluster0.8n60td7.mongodb.net/Paytm", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const userschema = mongoose.Schema({
    username : String,
    password : String,
    firstname : String ,
    lastname : String
})


const user = mongoose.model('user' , userschema)

module.exports = {user};