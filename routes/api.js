module.exports = function(app) {
    let User = require("../models/users.js");

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

}