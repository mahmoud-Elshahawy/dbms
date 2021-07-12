var express = require ("express");
var path = require("path");
var app= express();
var mongoose= require("mongoose");
var cookieparser= require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
var param = require("./params/param");
mongoose.connect(param.connection,{useUnifiedTopology:true, useNewUrlParser:true, useCreateIndex:true});
mongoose.set('useFindAndModify', false);
app.set("port",process.env.PORT || 3000);
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieparser());
app.use(session({
    secret:"ashkdbaskfholahdasdjk",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/api",require("./routes/api"));
app.use("/",require("./routes/web"));
app.listen(app.get("port"),function(){
    console.log("Success: "+ app.get("port"));
});