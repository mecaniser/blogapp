var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var ejs = require('ejs')
var app = express();
var PORT = process.env.PORT || 3036;

mongoose.connect("mongodb://localhost/mecaniser_rest_app");
//App config

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
// Mogoose - model config
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

//Post route
app.post("/blogs", function(req,res){
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
    })
});

app.listen(PORT, function () {
    console.log("App listening on PORT http://localhost:" + PORT);
});