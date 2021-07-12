var express= require("express");
var router= express.Router();
var User=require("../../models/user");
var Car=require("../../models/cars");
var Zone=require("../../models/zone");
var Garage=require("../../models/garage");
var carClass=require("../../models/classes");
var methodOverride = require('method-override');
const { render } = require("ejs");
router.use(methodOverride('_method'));
router.get("/",function(req,res){
    res.render("index");
});
router.get("/index",function(req,res){
    res.render("index");
});
router.get("/add-car",function(req,res){
    res.render("add-car");
});
router.get("/add-zone",function(req,res){
    res.render("add-zone");
});
router.get("/add-garage",function(req,res){
    res.render("add-garage");
});
router.get("/ban",function(req,res){
    res.render("ban");
});
router.get("/change-car-class",function(req,res){
    res.render("change-car-class");
})
router.get("/change-car-state",function(req,res){
    res.render("change-car-state");
})
router.get("/change-class-fare",function(req,res){
    res.render("change-class-fare");
})
router.get("/change-garage-state",function(req,res){
    res.render("change-garage-state");
})
router.get("/penalty",function(req,res){
    res.render("penalty");
})
router.get("/remove-car",function(req,res){
    res.render("remove-car");
})
router.post("/register",async function(req,res,next){
    var username=req.body.username;
    var pass=req.body.password;
    var email=req.body.email;
    var repass=req.body.repassword;
   
    const user=new User({
        username:username,
        email:email,
        password:pass
    });
    try {
        const saved = await user.save();
        res.send({user:user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});
router.post("/add-zone",async function(req,res,next){
    var zonename=req.body.zone_name;
    var cor1=Number(req.body.p1);
    var cor2=Number(req.body.p2);
    var cor3=Number(req.body.p3);
    var cor4=Number(req.body.p4);
    var cor5=Number(req.body.p5);
    var cor6=Number(req.body.p6);
    var cor7=Number(req.body.p7);
    var cor8=Number(req.body.p8);
    const coordinates=[[[cor1,cor2],[cor3,cor4],[cor5,cor6],[cor7,cor8],[cor1,cor2]]];
    const zone=new Zone({
        name:zonename,
        geometry:{
            type:'Polygon',
            coordinates:coordinates
        }
    });
    try {
        const saved = await zone.save();
        res.send("Zone Is Added Successfully");
    } catch (error) {
        res.status(400).send(error);
    }
})
router.post("/add-garage",async function(req,res,next){
    var cor1=Number(req.body.co1);
    var cor2=Number(req.body.co2);
    const loc=[cor1,cor2];
    const rez = await Zone.findOne({
        geometry: {
          $geoIntersects: { $geometry: loc }
        }
      });
      const garage=new Garage({
          zoneID:rez._id,
          location:{
              type:'Point',
              coordinates:loc
          }
      })
    try {
        const saved = await garage.save();
        res.send("Garage Is Added Successfully");
    } catch (error) {
        res.status(400).send(error);
    }
})
router.post("/add-car",async function(req,res,next){
    var brand=req.body.brand;
    var plate=req.body.plate;
    var color=req.body.color;
    var carClass=req.body.class;
    var cor1=Number(req.body.cor1);
    var cor2=Number(req.body.cor2);
    const loc=[cor1,cor2];
    const rez = await Garage.findOne({
        state:"Available",
        location: {
         $nearSphere: { $geometry:{
             type : "Point",
             coordinates : loc
         }}
        }
      })
    const car=new Car({
        brand:brand,
        plate:plate,
        color:color,
        class:carClass,
        garageID:rez._id
    })
    try {
        const saved = await car.save();
        res.send({car:car._id});
    } catch (error) {
        res.status(400).send(error);
    }
})
router.put("/ban/:id",async function(req,res,next){
    var email={email:req.body.email};
    var update={State: req.body.state};
    try{
    var user=await User.findOneAndUpdate(email,update);
        console.log(user.State);
        res.send("User State is "+req.body.state);
}
    catch (error) {
        res.status(400).send(error);
    }
})
router.put("/changecarclass/:id", async function(req,res,next){
    var plate={plate:req.body.plate};
    var carClass={class:req.body.class};
    try{
        var car= await Car.findOneAndUpdate(plate,carClass);
        res.send("Car Class Updated");
        }
        catch(error){
            res.status(400).send(error);
        }
})
router.put("/changecarstate/:id",async function(req,res,next){
    var plate={palte:req.body.palte};
    var state={state:req.body.state};
    try{
        let car=await Car.findOneAndUpdate(plate,state);
        res.send("Car state has been updated");
    }
    catch(error){
        res.status(400).send(error);
    }
})
router.put("/changeclassfare/:id",async function(req,res, next){
    var current={class:req.body.class};
    var fare={baseFare:req.body.baseFare};
    try{
        let c=await carClass.findOneAndUpdate(current,fare);
        res.send("Class base fare updated to "+ req.body.baseFare);
    }
    catch(error){
        res.status(400).send(error);
    }
})
router.put("/changegaragestate/:id",async function(req,res,next){
    var cor1=Number(req.body.latit);
    var cor2=Number(req.body.long);
    var state={state:req.body.state};
    const loc=[cor1,cor2];
    try{
        const rez = await Garage.findOne({
            state:"Available",
            location: {
             $nearSphere: { $geometry:{
                 type : "Point",
                 coordinates : loc
             }}
            }
          })
          let garage=await Garage.findByIdAndUpdate(rez._id,state);
          res.send("Garage State Updated");
}
catch (error){
    res.status(400).send(error);
}})
router.put("/addpenalty/:id",async function(req,res,next){
    var email={email:req.body.email};
    var penalty={penalty:req.body.penalty};
    try{
        let user= await User.findOneAndUpdate(email,penalty);
        res.send("Penalty of "+req.body.penalty +" is added to user whose email is "+req.body.email);
    }
    catch (error){
        res.status(400).send(error);
    }
})
router.delete("/removecar/:id",async function(req,res,next){
    var plate={plate:req.body.plate};
    try{
        let car=await Car.findOneAndDelete(plate);
        res.send("Car has been deleted successfully");
    }
    catch (error){
        res.status(400).send(error);
    }
})

module.exports=router;