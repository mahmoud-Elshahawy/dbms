var express= require("express");
var router= express.Router();
router.get("/",function (req,res) {
    res.json("USERS API RESULT");
})

module.exports=router;