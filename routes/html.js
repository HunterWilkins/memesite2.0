module.exports = function(app) {
    app.get("/", function(req, res) {
        console.log("User Id: " + req.session.userId);
        if (req.session.userId) {
            console.log("Found the user.");
            res.render("frontpage", {userId: req.session.userId});
        }

        else {
            console.log("Not Logged In");
            res.render("frontpage");
        }
    });
}