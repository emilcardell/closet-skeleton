module.exports = function(app) {
    app.get('/logout', (req, resp) => {
        req.logout();
        resp.redirect('/');
    });
};
