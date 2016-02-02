import React from 'react';
import iz from 'emilcardell/iz';
import are from 'emilcardell/iz/src/are';
import 'github/fetch';
import ValidationMessage from '/js/validationMessage';
import ValidationClassHelper from '/js/ValidationClassHelper';

const ResetChangePassword = React.createClass({
    getInitialState() {
        return {
            email: '',
            validationResult: {},
            showThankYouMessage: false,
            showForm: true,
            showServerErrorMessage: false,
            showNotFoundMessage: false,
            showLoader: true,
            resetid: null
        };
    },
    componentDidMount() {
        let paths = window.location.pathname.split("/");
        let resetid = paths[paths.length-1];
        console.log('/api/user/resetPassword/' + resetid);
        fetch('/api/user/resetPassword/' + resetid).then((response) => {
            if (response.status !== 200) {
                this.setState({
                    showUserNotFound: true,
                    showLoader: false
                });
            }

            this.setState({
                showForm: true,
                showLoader: false,
                resetid: resetid
            });
        }).catch(() => {
            this.setState({
                showUserNotFound: true,
                showLoader: false
            });
        });
    },
    handleEmailChange(event) {
        this.setState( { email: event.target.value } );
    },
    handleSubmit(event) {
        event.preventDefault();
        let paths = window.location.pathname.split("/");
        let requestid = paths[paths.length-1];
        let resetModel = {
            requestid: requestid,
            password: this.state.password,
            passwordVerification: this.state.passwordVerification
        };

        let changePasswordRules = {
            'resetid': [
                {
                    'rule': 'required',
                    'error': 'You must enter your name.'
                }
            ],
            'password': [
                {
                    'rule': 'required',
                    'error': 'A password is requered to get access.'
                },
                {
                    'rule': 'minLength',
                    'args': [6],
                    'error': 'Password must be between 6 and 1000 characters.'
                },
                {
                    'rule': 'maxLength',
                    'args': [1024],
                    'error': 'Password must be between 6 and 1000 characters.'
                }
            ],
            'passwordVerification': [
                {
                    'rule': 'required',
                    'error': 'You have to verify your password.'
                },
                {
                    'rule': 'equal',
                    'args': [this.state.password],
                    'error': 'Passwords dosent match'
                }
            ]
        };

        let areRules = are(changePasswordRules);

        if (!areRules.validFor(resetModel)) {
            this.setState({
                validationResult: areRules.getInvalidFields()
            });
            return;
        }

        fetch('/api/user/resetPassword', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resetModel)
        }).then((response) => {

            if (response.status === 404) {
                this.setState({
                    showNotFoundMessage: true
                });
                return;
            }

            if (response.status !== 200) {
                this.setState({
                    showServerErrorMessage: true
                });
                return;
            }

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

        if (this.state.showLoader) {
            return(<div className="spinner">
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                    </div>);
        }

        let passwordMessage = null;
        if (this.state.password && this.state.password.length > 1 && this.state.password.length < 6) {
            passwordMessage = <div className="password-message__negative">Your password is too short.</div>;
        } else if (this.state.password && this.state.password.length >= 6) {
            passwordMessage = <div className="password-message__positive">Your password is ok.</div>;
        }

        if (this.state.showThankYouMessage) {
            return (<div className="thank-you-message">An e-mail will be sent to you shortly with further instructions.</div>);
        }

        let serverErrorMessage = '';
        if (this.state.showServerErrorMessage) {
            serverErrorMessage = <div className="server-error-messge">Something went wrong.</div>;
        }

        if (this.state.showNotFoundMessage) {
            serverErrorMessage = <div className="server-error-messge">E-mail could not be found.</div>;
        }

        return (<form onSubmit={this.handleSubmit} noValidate>
          <div className="row">
              <label htmlFor="password">Password</label>
              <input className={ ValidationClassHelper("u-full-width", 'password', this.state.validationResult) } type="password" placeholder="Password goes here." id="password" onChange={this.handleFieldChange} value={this.state.password} required />
              { passwordMessage }
              <ValidationMessage validationResult={this.state.validationResult} inputName="password" ></ValidationMessage>

              <label htmlFor="passwordVerification">Verify password</label>
              <input className={ ValidationClassHelper("u-full-width", 'passwordVerification', this.state.validationResult) } type="password" placeholder="Check password again." id="passwordVerification" onChange={this.handleFieldChange} value={this.state.passwordVerification} required />
              <ValidationMessage validationResult={this.state.validationResult} inputName="passwordVerification"></ValidationMessage>

              <input className="button-primary u-full-width" type="submit" value="Submit" />
              { serverErrorMessage }
          </div>
        </form>);
    }
});

export default ResetChangePassword;
