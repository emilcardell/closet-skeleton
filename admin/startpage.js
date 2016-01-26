const userHelper = require('../utils/userHelper.js');

module.exports = function(app) {

    app.get('/admin', (req, resp) => {
        if (!userHelper.userIsAdminCheck(req, resp)) { return; }
        console.log('I should not be here'); 
        userHelper.renderWithCurrentUser(req, resp, 'startpage', {});
    });

};
