const renderWithCurrentUser = function(req, resp, template, data) {
    if (req.user) {
        if (!data) {
            data = {};
        }
        data.currentUser = req.user;
    }
    return resp.render(template, data);
};

const userIsLoggedInCheck = function(req, resp) {
    if (!req.user) {
        resp.status(403).render('message_forbidden');
        return false;
    }
    return true;
};

const userIsAdminCheck = function(req, resp) {
    if (!req.user || !req.user.isAdmin) {
        resp.status(403).render('message_forbidden');
        return false;
    }
    return true;
};

module.exports = {
    renderWithCurrentUser: renderWithCurrentUser,
    userIsLoggedInCheck: userIsLoggedInCheck,
    userIsAdminCheck: userIsAdminCheck
};
