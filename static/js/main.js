import React from 'react';
import CreateUserForm from '/js/createUserForm';
import AuthenticateUserForm from '/js/authenticateUserForm';
import ReactDOM from 'react-dom';

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
