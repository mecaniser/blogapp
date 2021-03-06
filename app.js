var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var express     = require("express");
var ejs         = require('ejs');
var exprsSntzr  = require("express-sanitizer");
var app         = express();
var methodOvrrd = require("method-override");

//App config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(exprsSntzr());
app.use(methodOvrrd("_method"));


// Mongoose - model config

var blgSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created: {
        type: Date,
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", blgSchema);

app.get("/", function (req, res) {
    res.redirect("/blogs");
});
//Main page
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Yooo, There is an Error !!!");
        } else {
            res.render("index",{blogs:blogs});
        }
    });
});

//New route
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//Create route
app.post("/blogs", function(req,res){

    //Sanitizer
    console.log(req.body);

    req.body.blog.body = req.sanitize(req.body.blog.body);

    console.log("---------------------------------------");

    console.log(req.body);

    Blog.create(req.body.blog, function(err, newBlog){
if(err){
    res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//Show route page
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
                res.redirect("/blogs");
        }else{
            res.render("showIt",{blog:foundBlog});
        }
    });
});
//Edit route
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog}); 
        }
    });
});

//Update route
app.put("/blogs/:id",function(req,res){
    //Sanitizer
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//Delete route

app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if (err) {
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

console.log('Connected to the Development DB: ' + process.env.DATABASEURL);

var dataBase = process.env.DATABASEURL || "mongodb://localhost/mecaniser_rest_app" ;


mongoose.connect(dataBase, function (err, res) {

    if (err) {
    console.log ('ERROR connecting to: ' + dataBase+ '. ' + err);
    } else {
    console.log ('Succeeded connected to HEROKU DB: ' + dataBase);
    }
  });

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});

// console.log("App listening on PORT http://localhost:" + PORT);
// var MONGOLAB_RED_URI = process.env.MONGOLAB_RED_URI || "mongodb://mecaniser:bacardi888@ds123171.mlab.com:23171/heroku_bg825klm";