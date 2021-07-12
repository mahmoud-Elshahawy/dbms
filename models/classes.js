const mongoose = require('mongoose');
const randToken = require('rand-token');


const classesSchema = new mongoose.Schema({
    UUID: {
        type: String,
        default: function() {
            return randToken.generate(16);
        },
        unique: true
    },
    
    class : {
        type: String,
        required: true,
        unique: true

     },

    
    baseFare : {
            type: Number ,
            required: true, 
           

    }
    
     
 

});
var classes=mongoose.model('class',classesSchema);
module.exports = classes;