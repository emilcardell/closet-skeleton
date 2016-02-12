import React from 'react';
import iz from 'emilcardell/iz/src/iz';
import are from 'emilcardell/iz/src/are';
import 'github/fetch';
import ValidationMessage from '/static/js/validationMessage';
import ValidationClassHelper from '/static/js/ValidationClassHelper';



const CreateOrganisationUserForm = React.createClass({
    getInitialState() {
        return {
            fullName: null,
            password: null,
            passwordVerification: null,
            validationResult: {},
            showLoader: true,
            showUserNotFound: false,
            showForm: false,
            emailAuthId: null
        };
    },
    handleFieldChange(event) {
        let values = {};
        values[event.target.id] = event.target.value;
        this.setState( values);
    },
    handleSubmit(event) {
        event.preventDefault();

        let createOrganisationRules = {
            'fullName': [
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

        let areRules = are(createOrganisationRules);
        let modelToSave = { fullName: this.state.fullName, password: this.state.password, passwordVerification: this.state.passwordVerification };
        if (!areRules.validFor(modelToSave)) {
            this.setState({
                validationResult: areRules.getInvalidFields()
            });
            return;
        }

        modelToSave.emailAuthId = this.state.emailAuthId;

        fetch('/api/user/createOrganisation', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modelToSave)
        }).then((response) => {

            if (response.status !== 200) {
                alert('Something went horribly wrong');
                return;
            }
            alert('Saved ' + response.status);
            //redirect user
        }).catch(() => {
            alert('This should not happen.');
        });

    },
    componentDidMount() {
        let paths = window.location.pathname.split("/");
        let emailAuthId = paths[paths.length-1];

        fetch('/api/user/createOrganisation/' + emailAuthId).then((response) => {
            if (response.status !== 200) {
                this.setState({
                    showUserNotFound: true,
                    showLoader: false
                });
            }

            this.setState({
                showForm: true,
                showLoader: false,
                emailAuthId: emailAuthId
            });
        }).catch(() => {
            this.setState({
                showUserNotFound: true,
                showLoader: false
            });
        });
    },
    render() {

        let passwordMessage = null;
        if (this.state.password && this.state.password.length > 1 && this.state.password.length < 6) {
            passwordMessage = <div className="password-message__negative">Your password is too short.</div>;
        } else if (this.state.password && this.state.password.length >= 6) {
            passwordMessage = <div className="password-message__positive">Your password is ok.</div>
        }

        if (this.state.showLoader) {
            return(<div className="spinner">
                      <div className="bounce1"></div>
                      <div className="bounce2"></div>
                      <div className="bounce3"></div>
                    </div>);
        }

        if (this.state.showUserNotFound) {
            return (<div><h4>Something did not go as planed.</h4>
            <p>Either your account has already been created or a serious error has occured.</p></div>);
        }

        let serverErrorMessage = '';
        if (this.state.showServerErrorMessage) {
            serverErrorMessage = <div className="server-error-messge">Something went wrong on the server please try again later.</div>;
        }

        return (<form onSubmit={this.handleSubmit} noValidate>
          <div className="row">
              <h4>Almost there</h4>
              <p>We need some more information to get started.</p>

              <label htmlFor="fullName">Full Name</label>
              <input className={ ValidationClassHelper("u-full-width", 'fullName', this.state.validationResult) } type="text" placeholder="Your full name here." id="fullName" onChange={this.handleFieldChange} value={this.state.fullName} required />
              <ValidationMessage validationResult={this.state.validationResult} inputName="fullName"></ValidationMessage>

              <label htmlFor="password">Password</label>
              <input className={ ValidationClassHelper("u-full-width", 'password', this.state.validationResult) } type="password" placeholder="Password goes here." id="password" onChange={this.handleFieldChange} value={this.state.password} required />
              { passwordMessage }
              <ValidationMessage validationResult={this.state.validationResult} inputName="password" ></ValidationMessage>

              <label htmlFor="passwordVerification">Verify password</label>
              <input className={ ValidationClassHelper("u-full-width", 'passwordVerification', this.state.validationResult) } type="password" placeholder="Check password again." id="passwordVerification" onChange={this.handleFieldChange} value={this.state.passwordVerification} required />
              <ValidationMessage validationResult={this.state.validationResult} inputName="passwordVerification"></ValidationMessage>

              <button className="btn-flat waves-effect waves-light lime" type="submit">Next step</button>
              { serverErrorMessage }
          </div>
        </form>);
    }
});

export default CreateOrganisationUserForm;
