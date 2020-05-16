const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const url = "mongodb://localhost:27017/wikiDB";
const app = express();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//chaining method
/////////////////// All Article /////////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

/////////////////// Specific Article /////////////////////

app
  .route("/articles/:title")
  .get(function (req, res) {
    Article.findOne({ title: req.params.title }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("Not found");
      }
    });
  })
  .put(function (req, res) {
    Article.update(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send(
            "Success fully updated " +
              req.params.title +
              " to " +
              req.body.title
          );
        } else {
        }
      }
    );
  })
  .patch(function (req, res) {
    Article.update({ title: req.params.title }, { $set: req.body }, function (
      err
    ) {
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.title }, function (err) {
      if (!err) {
        res.send("Successfully deleted " + req.params.title);
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started listening to port 3000");
});
