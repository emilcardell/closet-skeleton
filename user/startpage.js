const userHelper = require('../utils/userHelper.js');

module.exports = function(app) {

    app.get('/startpage', (req, resp) => {
        if (!userHelper.userIsLoggedInCheck(req, resp)) { return; }
        userHelper.renderWithCurrentUser(req, resp, 'startpage', {});
    });

};
