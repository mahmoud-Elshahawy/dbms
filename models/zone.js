const mongoose = require('mongoose');
const randToken = require('rand-token');


const zoneSchema = new mongoose.Schema({
    UUID: {
        type: String,
        default: function() {
            return randToken.generate(16);
        },
        unique: true
    },
   
    name : {
     type: String,
     required: true
    },

    geometry : {
    type: {
        type: String,
        enum: ['Polygon'],
        required: true
      },

      coordinates: {
        type: [[[Number]]], // Array of arrays of arrays of numbers
        required: true
      }  
    },

    //   garageID : 
    //   [{ type: mongoose.Schema.ObjectId, ref: 'garage',unique: true }]
    
     
 

});
var zone=mongoose.model("zone",zoneSchema);
module.exports=zone;