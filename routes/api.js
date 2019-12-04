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
    });

    app.get("/api/posts/search/:term", function(req, ram) {
    
        let results = {
            users: [],
            posts: []
        }

        User.find({
            username: req.params.term
        }).then(function(dbUsers) {
            dbUsers.forEach(item => {
                results.users.push(item.username);
            });

            Post.find({
                title: req.params.term
            }).then(function(dbPosts) {
                dbPosts.forEach(item => {
                    results.posts.push({
                        author: item.author,
                        postId: item.id
                    });
                });

                res.json(results)
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

    })

    app.get("/api/currentUser", function(req, res) {
        User.findOne({
            id: req.session.userId
        }).then(function(dbUser) {
            console.log(dbUser);
            Post.find({
                author: dbUser.username
            }).then(function(dbPosts) {
                let myComments = [];
                dbPosts.forEach(post => {
                    post.comments.forEach(comment => {
                        if (post.id === comment.postId) {
                            let commentInfo = {
                                commentObj: comment,
                                postTitle: post.title
                            }

                            myComments.push(commentInfo);

                        }
                    })
                })
                console.log(dbPosts);
                let response = {
                    posts: dbPosts,
                    comments: myComments
                }
                res.json(response);
            });
        }).catch(function(err) {
            res.json(err);
        });
    });

    app.post("/api/signup", function(req, res) {
        console.log("Signing Up...");
        console.log(req.body);
        req.session.userId = req.body.id;
        User.create(req.body)
        .then(function(dbUser) {
            console.log(dbUser);
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

            let today = new Date();
            let date = today.getFullYear() + " - " + (today.getMonth() + 1) + " - " + today.getDate();

            let newPost = {
                id: req.body.id,
                title: req.body.title,
                body: req.body.body,
                genre: req.body.genre,
                tags: req.body.tags,
                author: dbUser.username,
                upvotes: 0,
                downvotes: 0,
                date: date,
                timeCreated: Date.now(),
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

    app.put("/api/createComment", function(req, res) {
        let newComment = {
            author: req.session.username,
            text: req.body.text,
            postId: req.body.postId,
            date: req.body.date,
            timeCreated: req.body.timeCreated,
            id: Math.floor(Math.random()*400000) + req.body.timeCreated + req.body.postId + req.session.username
        }
        console.log(newComment);
        Post.findOneAndUpdate({
            id: req.body.postId
        }, {$push : {comments: newComment}})
        .then(function(dbPost) {
            res.sendStatus(200);
        }).catch(err => console.log(err));
    });

    app.put("/api/deleteComment", function(req, res) {
        Post.findOneAndUpdate({
            id: req.body.postId
        }, {$pull: {"comments": {"text": req.body.text}}}).then(function(dbPost){
            console.log("Successfully Deleted Comment.");
            res.sendStatus(200);
        }).catch(err => console.log(err));
    })

    app.delete("/api/deletePost", function(req, res) {
        Post.deleteOne({id: req.body.postId})
        .then(function() {
            res.sendStatus(200);
        }).catch(err => {
            console.log(err);
        })
    });

    app.put("/api/deleteTag", function(req, res) {
        Post.findOneAndUpdate({
            id: req.body.postId
        }, {$pull: {"tags" : req.body.tag}}).then(function(dbPost) {
            res.sendStatus(200);
            console.log("Removal Successful!");
        }).catch(err => console.log(err));
    });

    app.put("/api/updatePost", function(req, res) {
        Post.findOneAndUpdate({
            id: req.body.postId
        }, {[req.body.field] : req.body.update}, {new: true, upsert: true})
        .then(function(dbPost) {
            res.sendStatus(200);
        }).catch(err => console.log(err));
    });

    app.put("/api/vote", function(req, res) {
        
        vote = req.body.value === "+" ? "upvotes" : "downvotes";

        console.log(vote);
        console.log(req.body.id);

        Post.findOneAndUpdate({
            id: req.body.id
        }, {$inc: {[vote]: 1}}).then(function(dbPost) {
            res.json(dbPost);
        }).catch(err=>console.log(err));    
    })

    app.delete("/api/user/delete", function(req, res) {
        User.deleteOne({
            id: req.session.userId
        }).then(function() {
            req.session.destroy();
            res.sendStatus(200);
        }).catch(err => console.log(err));
    });

}