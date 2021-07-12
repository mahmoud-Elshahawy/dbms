const mongoose = require('mongoose');
const randToken = require('rand-token');


const userSchema = new mongoose.Schema({
   
    UUID: {
        type: String,
        default: function() {
            return randToken.generate(16);
        },
        unique: true
    },
    email : {
        type:String, 
        required: true, 
        min: 6
    },
     State : {
         type: String,
         default: "valid",
       

     },
     penalty : {
         type: Number,
         default:"0"
     }

    
    

});
var user=mongoose.model("user",userSchema);
module.exports=user;