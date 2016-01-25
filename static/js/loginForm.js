import React from 'react';
import iz from 'emilcardell/iz';
import are from 'emilcardell/iz/src/are';
import 'github/fetch';
import ValidationMessage from '/js/validationMessage';
import ValidationClassHelper from '/js/ValidationClassHelper';

const loginRules = {
    'email': [
        {
            'rule': 'required',
            'error': 'You must specify an e-mail adrress.'
        }
    ],
    'password': [
        {
            'rule': 'required',
            'error': 'You must enter a password.'
        }
    ]
};

const LoginForm = React.createClass({
    getInitialState() {
        return {
            email: null,
            password: null,
            validationResult: {},
            showLoginNotAccepted: '',
            showServerErrorMessage: ''
        };
    },
    handleFieldChange(event) {
        let values = {};
        values[event.target.id] = event.target.value;
        this.setState( values);
    },
    handleSubmit(event) {
        event.preventDefault();
        let loginModel = {
            email: this.state.email,
            password: this.state.password
        };

        let areRules = are(loginRules);

        if (!areRules.validFor(loginModel)) {
            this.setState({
                validationResult: areRules.getInvalidFields()
            });
            return;
        }

        fetch('/api/user/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginModel)
        }).then((response) => {

            if (response.status === 404) {
                this.setState({
                    showLoginNotAccepted: true
                });
                return;
            }

            if (response.status !== 200) {
                this.setState({
                    showServerError: true
                });
                return;
            }
            alert('login successfull');
            this.setState({
                showThankYouMessage: true
            });
        }).catch(() => {
            this.setState({
                showServerErrorMessage: true
            });
        });
    },
    render() {
        let serverErrorMessage = '';
        if (this.state.showServerErrorMessage) {
            serverErrorMessage = <div className="server-error-messge">Something went wrong on the server please try again later.</div>;
        }

        let loginNotAcceptedMessage = '';
        if (this.state.showServerErrorMessage) {
            loginNotAcceptedMessage = <div className="server-error-messge">Wrong e-mail or password. Do you have capslock on?</div>;
        }


        return (<form onSubmit={this.handleSubmit} noValidate>
          <div className="row">
              <label htmlFor="emailField">Your email</label>
              <input className={ ValidationClassHelper("u-full-width", 'email', this.state.validationResult) } type="email" placeholder="Enter your e-mail here." id="email" onChange={this.handleFieldChange} value={this.state.email} required />
              <ValidationMessage validationResult={this.state.validationResult} inputName="email" text="You have to enter a valid e-mailaddress."></ValidationMessage>

              <label htmlFor="password">Password</label>
              <input className={ ValidationClassHelper("u-full-width", 'password', this.state.validationResult) } type="password" placeholder="Password goes here." id="password" onChange={this.handleFieldChange} value={this.state.password} required />
              <ValidationMessage validationResult={this.state.validationResult} inputName="password" ></ValidationMessage>


              <input className="button-primary u-full-width" type="submit" value="Submit" />

              { serverErrorMessage }
              { loginNotAcceptedMessage }
          </div>
        </form>);
    }
});

export default LoginForm;
