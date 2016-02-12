import React from 'react';
import RequestAccountForm from '/static/js/requestAccountForm';
import CreateOrganisationForm from '/static/js/createOrganisationForm';
import LoginForm from '/static/js/loginForm';
import ReactDOM from 'react-dom';
import ResetPassword from '/static/js/resetPassword';
import ResetChangePassword from '/static/js/resetChangePassword';

if ( document.getElementById('requestAccountForm')) {
    ReactDOM.render(
     <RequestAccountForm />,
     document.getElementById('requestAccountForm')
    );
}

if ( document.getElementById('createOrganisationForm')) {
    ReactDOM.render(
     <CreateOrganisationForm />,
     document.getElementById('createOrganisationForm')
    );
}

if ( document.getElementById('loginForm')) {
    ReactDOM.render(
     <LoginForm />,
     document.getElementById('loginForm')
    );
}

if ( document.getElementById('resetPassword')) {
    ReactDOM.render(
     <ResetPassword />,
     document.getElementById('resetPassword')
    );
}

if ( document.getElementById('resetChangePassword')) {
    ReactDOM.render(
     <ResetChangePassword />,
     document.getElementById('resetChangePassword')
    );
}
