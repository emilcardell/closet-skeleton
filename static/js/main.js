import React from 'react';
import CreateUserForm from '/static/js/createUserForm';
import AuthenticateUserForm from '/static/js/authenticateUserForm';
import LoginForm from '/static/js/loginForm';
import ReactDOM from 'react-dom';
import ResetPassword from '/static/js/resetPassword';
import ResetChangePassword from '/static/js/resetChangePassword';

if ( document.getElementById('createUserForm')) {
    ReactDOM.render(
     <CreateUserForm />,
     document.getElementById('createUserForm')
    );
}

if ( document.getElementById('authenticateUserForm')) {
    ReactDOM.render(
     <AuthenticateUserForm />,
     document.getElementById('authenticateUserForm')
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
