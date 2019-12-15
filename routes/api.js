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

    app.post("/api/posts/:genre", function(req, res) {
        console.log("================FINDING POSTS================");
        console.log(req.params.genre);
        Post.find(req.params.genre === "all" || req.params.genre === "undefined" ? {} : {genre: req.params.genre})
        .then(function(dbPosts) {
            console.log("=/=/=/=/=/Found These Posts:/=/=/=/=/");
            let resultingPosts = [];
            let tags = req.body.tags ? req.body.tags.split(",") : null;
            console.log("=/=/=/=/=/The Available Tags/=/=/=/=/");
            console.log(tags);
            if (tags !== null) {
                console.log("=/=/=/=/=/Tags Found!/=/=/=/=/=/");
                dbPosts.forEach(post => {
                    tags.forEach(item => {
                        if (post.tags.indexOf(item) !== -1) {
                            console.log("Found tag!");
                            console.log(post);
                            resultingPosts.push(post);
                        };
                    });
                });
                res.json(resultingPosts);
            }
            else {
                res.json(dbPosts);
            }
        }).catch(function(err) {
            res.json(err);
        });    
    });

    app.get("/api/currentUser", function(req, res) {
            Post.find({})
            .then(function(dbPosts) {
                let myPosts = [];
                let myComments = [];

                dbPosts.forEach(post => {
                    if (post.author === req.session.username) {
                        myPosts.push(post);
                    };

                    post.comments.forEach(comment => {
                        if (comment.author === req.session.username) {
                            let commentObj = comment;
                            commentObj.postTitle = post.title;
                            myComments.push(commentObj);
                        }
                    })
                });
                
                let response = {
                    posts: myPosts,
                    comments: myComments
                }

                res.json(response);
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

    app.post("/api/search", function(req, res) {
        Post.find({})
        .then(function(dbPosts) {
            let response = [];

            dbPosts.forEach(post => {
                if (post.tags.indexOf(req.body.term) !== -1
                || post.title === req.body.term
                || post.author === req.body.term) {
                    response.push(post);
                }
            });
            console.log("These are the search results:");
            console.log(response);
            res.json(response);
        }).catch(err => console.log(err));
    })

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
                imageLink: req.body.imageLink,
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

    app.put("/api/updateComment", function(req, res){
        console.log("Updating Comment...");
        console.log(req.body);
        Post.findOneAndUpdate({
            id: req.body.postId    
        }, {$set: {"comments.$[comment].text" : req.body.text}}, 
        {
            arrayFilters: [{"comment.id" : req.body.commentId}],
            new: true,
            useFindAndModify: false
        }
        
        ).then(function(dbPost) {
            console.log(dbPost);
            console.log(dbPost.comments);
            dbPost.comments.forEach(item => {
                if (item.id === req.body.commentId) {
                    item.textt = req.body.text
                }
            });
            res.json(dbPost);
        }).catch(err => console.log(err));
        
    });

    app.put("/api/deleteComment", function(req, res) {
        Post.findOneAndUpdate({
            id: req.body.postId
        }, {$pull: {"comments": {"text": req.body.text}}}, {useFindAndModify: false}).then(function(dbPost){
            console.log("Successfully Deleted Comment.");
            res.sendStatus(200);
        }).catch(err => console.log(err));
    });

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
        }, {$pull: {"tags" : req.body.tag}}, {useFindAndModify: false}).then(function(dbPost) {
            res.sendStatus(200);
            console.log("Removal Successful!");
        }).catch(err => console.log(err));
    });

    app.put("/api/updatePost", function(req, res) {
        Post.findOneAndUpdate({
            id: req.body.postId
        }, {[req.body.field] : req.body.update}, {new: true, upsert: true, useFindAndModify: false})
        .then(function(dbPost) {
            res.sendStatus(200);
        }).catch(err => console.log(err));
    });

    app.put("/api/vote", function(req, res) {
        
        vote = req.body.value === "+" ? "upvotes" : "downvotes";

        Post.findOneAndUpdate({
            id: req.body.id
        }, {$inc: {[vote]: 1}}, {useFindAndModify: false}).then(function(dbPost) {
            res.json(dbPost);
        }).catch(err=>console.log(err));    
    });

    app.delete("/api/user/delete", function(req, res) {
        User.deleteOne({
            id: req.session.userId
        }).then(function() {
            req.session.destroy();
            res.sendStatus(200);
        }).catch(err => console.log(err));
    });

}