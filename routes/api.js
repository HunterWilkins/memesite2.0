module.exports = function(app) {
    let User = require("../models/users.js");
    let Post = require("../models/posts.js");

    app.get("/api/post/all", function(req, res) {
        Post.find({})
        .then(function(dbPosts) {
            res.json(dbPosts);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/signup", function(req, res) {
        console.log("Signing Up...");
        console.log(req.body);
        User.create(req.body)
        .then(function(dbUser) {
            console.log(dbUser);
            res.json(dbUser);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/signin", function(req, res) {
        console.log("Signing In...");
        console.log(req.body);
        let newId = Math.floor(Math.random()*2000).toString();
        User.findOneAndUpdate({
            username: req.body.username,
            password: req.body.password
        }, {"id" : newId}, {useFindAndModify: false})
        .then(function(dbUser) {
            req.session.userId = newId;
            res.json(dbUser);
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/logout", function(req, res) {
        req.session.destroy();
        res.sendStatus(200);
    });

    app.post("/api/createPost", function(req, res) {
        let newId = Math.floor(Math.random()*2000).toString();
        User.findOne({
            id: req.session.userId 
        })
        .then(function(dbUser) {

            let newPost = {
                title: req.body.title,
                body: req.body.body,
                genre: req.body.genre,
                tags: req.body.tags,
                author: dbUser.username,
                comments: []
            }
            Post.create(newPost)
            .then(function(dbPost) {
                console.log(dbPost);
                res.json(dbPost);
            });
        }).catch(function(err) {
            res.json(err);
        });

    });

}