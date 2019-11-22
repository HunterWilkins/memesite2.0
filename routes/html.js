module.exports = function(app) {
    app.get("/", function(req, res) {
        console.log(req.session.userId);
        res.render("frontpage", {userId: req.session.userId});
    });
}