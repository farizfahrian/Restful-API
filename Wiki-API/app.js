const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

app.set("set-engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("article", wikiSchema);

//////////////////////////////////////////// Routing all Articles ////////////////////////////////////////////

app.route("/articles")

    .get(function (req, res) {

        Article.find({}, function (err, articleContent) {
            if (!err) {
                res.send(articleContent);
            } else {
                console.log(err);
            }
        })
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article!");
            } else {
                res.send(err);
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Succesfully delete all articles!");
            } else {
                res.send(err);
            }
        })
    })

//////////////////////////////////////////// Routing a Specific Article ////////////////////////////////////////////

app.route("/articles/:articleTitle")

    .get(function (req, res) {
        Article.findOne({title: req.params.articleTitle}, function(err, articleContent) {
            if (articleContent) {
                res.send(articleContent);
            } else {
                res.send("Article title you search is not found.");
            }
        })
    })

    .put(function(req, res) {
        Article.update(
            {title:req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err, result) {
                if(!err) {
                    res.send(result);
                    res.send("Succesfully updated a new article.")
                } else {
                    res.send(err)
                }
            }
        )
    })

    .patch(function(req, res) {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err) {
                    res.send("Succesfully updated a new article.");
                } else {
                    res.send(err);
                }
            }
        )
    })

    .delete(function(req, res) {
        Article.deleteOne({title: req.params.articleTitle}, function(err) {
            if(!err) {
                res.send("Succesfully deleted an article.");
            } else {
                res.send(err);
            }
        })
    })

app.listen(3000, function () {
    console.log("Server running on port 3000");
})