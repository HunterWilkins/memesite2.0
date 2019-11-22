module.exports = function(app) {
    app.get("/", function(req, res) {
        res.render("frontpage", {userId: req.session.userId});
    });
}