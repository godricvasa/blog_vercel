const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to MongoDB Atlas
const uri = "mongodb+srv://godricvasa:7IHLhNUBSeeEkeFZ@blogify.q5vcavh.mongodb.net/?retryWrites=true&w=majority&appName=blogify";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const PostColl = mongoose.model("PostColl", postSchema);

app.get("/", async function(req, res) {
    const ele = await PostColl.find();
    res.render("home", {
        posts: ele,startContent:"welcome"
    });
});

app.get("/about", function(req, res) {
    res.render("about", {startContent: "I am vasa"});
});

app.get("/contact", function(req, res) {
    res.render("contact", {startContent: "godricvasa@gmail.com"});
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", async function(req, res) {
    let tit = req.body.title;
    let com = req.body.comp;
    const post = new PostColl({
        title: tit,
        content: com
    });
    await post.save();
    res.redirect("/");
});

app.get('/posts/:postid', async function(req, res) {
    let reqid = req.params.postid;
    const selectedPost = await PostColl.findOne({_id: reqid});
    res.render("post", {
        title: selectedPost.title,
        content: selectedPost.content
    });
});
app.listen(port, function() {
    console.log(`Server started on port ${port}`);
});
