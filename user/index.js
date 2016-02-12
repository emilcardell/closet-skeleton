module.exports = function(app) {
    require('./login.js')(app);
    require('./requestAccount.js')(app);
    require('./createOrganisation.js')(app);
    require('./startpage.js')(app);
    require('./logout.js')(app);
    require('./resetPassword.js')(app);
};
