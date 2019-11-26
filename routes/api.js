module.exports = function(app) {
    let User = require("../models/users.js");
    let Post = require("../models/posts.js");

    app.get("/api/post/:id", function(req, res) {
        Post.findOne({
            id: req.params.id
        })
        .then(function(dbPost) {
            res.json(dbPost);
        }).catch(function(err) {
            res.json(err);
        });
    
    });

    app.get("/api/posts/:genre", function(req, res) {
        if (req.params.genre === "all") {
            Post.find({})
            .then(function(dbPosts) {
                res.json(dbPosts);
            }).catch(function(err) {
                res.json(err);
            });    
        }
        
        else {
            Post.find({
                genre: req.params.genre
            }).then(function(dbPosts) {
                res.json(dbPosts);
            }).catch(function(err) {
                res.json(err);
            });    
        }
    })

    app.post("/api/currentUser", function(req, res) {
        User.findOne({
            id: req.session.userId
        }).then(function(dbUser) {
            req.session.username = dbUser.username;
            req.session.userId = dbUser.id;
            res.sendStatus(200);
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
            req.session.userId = newId;
            req.session.username = dbUser.username;
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
            if (dbUser) {
                req.session.userId = newId;
                req.session.username = dbUser.username;
                res.json(dbUser);    
            }
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/logout", function(req, res) {
        req.session.destroy();
        res.sendStatus(200);
    });

    app.post("/api/createPost", function(req, res) {
        console.log("Create Post Route Called");
        console.log(req.session.userId);
        User.findOneAndUpdate({
            id: req.session.userId 
        }, {"$push": {"posts": req.body.id}})
        .then(function(dbUser) {

            let newPost = {
                id: req.body.id,
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
            }).catch(err => {
                console.log(err);
            });

        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });

    });



}