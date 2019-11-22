module.exports = function(app) {
    app.get("/", function(req, res) {
        console.log("User Id: " + req.session.userId);
        res.render("frontpage", {userId: req.session.userId});
    });
}