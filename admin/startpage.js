"use strict";
const userHelper = require('../utils/userHelper.js');
const mongoDb = require('../utils/mongoConnection.js');

module.exports = function(app) {

    app.get('/admin', (req, resp) => {
        if (!userHelper.userIsAdminCheck(req, resp)) { return; }
        userHelper.renderWithCurrentUser(req, resp, 'startpage', {});
    });

    app.get('/admin/accountRequests', (req, resp) => {
        let db = mongoDb('accountRequests');
        db.accountRequests.find().then(function(docs) {
            resp.json(docs);
        });
    });

};
