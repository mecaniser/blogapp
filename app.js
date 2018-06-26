var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var express     = require("express");
var ejs         = require('ejs');
var app         = express();
var methodOvrrd = require("method-override");
var PORT        = process.env.PORT || 3036;

mongoose.connect("mongodb://localhost/mecaniser_rest_app");

//App config

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOvrrd("_method"));

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

app.listen(PORT, function () {
    console.log("App listening on PORT http://localhost:" + PORT);
});