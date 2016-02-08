import React from 'react';
import iz from 'emilcardell/iz';
import are from 'emilcardell/iz/src/are';
import 'github/fetch';
import ValidationMessage from '/static/js/validationMessage';
import ValidationClassHelper from '/static/js/ValidationClassHelper';

const requestAccountRules = {
    'email': [
        {
            'rule': 'email',
            'error': 'You have to enter a valid e-mail address.'
        },
        {
            'rule': 'required',
            'error': 'You must specify an e-mail adrress.'
        }
    ],
    'accountType': [
        {
            'rule': 'required',
            'error': 'You must specify an account type.'
        }
    ]
};

const RequestAccountForm = React.createClass({
    getInitialState() {
        return {
            email: '',
            accountType: 'Option 1',
            validationResult: {},
            showThankYouMessage: false,
            showForm: true,
            showServerErrorMessage: false
        };
    },
    componentDidMount() {
        $(this.refs.selectAccountType).material_select();
        $(this.refs.selectAccountType).on('change', this._onChange);
    },
    _onChange(e) {
        this.setState({
            accountType: e.target.value
        });
    },
    handleEmailChange(event) {
        this.setState( { email: event.target.value } );
    },
    handleAccountTypeChange(event) {
        this.setState( { accountType: event.target.value } );
    },
    handleSubmit(event) {
        event.preventDefault();
        let createModel = {
            email: this.state.email,
            accountType: this.state.accountType
        };

        let areRules = are(requestAccountRules);

        if (!areRules.validFor(createModel)) {
            this.setState({
                validationResult: areRules.getInvalidFields()
            });
            return;
        }

        fetch('/api/account/requestAccount', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createModel)
        }).then((response) => {

            if (response.status !== 200) {
                this.setState({
                    showServerErrorMessage: true
                });
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

        if (this.state.showThankYouMessage) {
            return (<div className="thank-you-message">Thank you for registering for our service.</div>);
        }

        let serverErrorMessage = '';
        if (this.state.showServerErrorMessage) {
            serverErrorMessage = <div className="server-error-messge">Something went wrong on the server please try again later.</div>;
        }

        return (<form onSubmit={this.handleSubmit} className="col s12" noValidate>

             <div className="row">
                 <div className="input-field col s12">

                      <input className={ ValidationClassHelper("validate", 'email', this.state.validationResult) } type="email" placeholder="Enter your e-mail here." id="emailField" onChange={this.handleEmailChange} value={this.state.email} required />
                      <label htmlFor="emailField" className="active">Your email</label>
                      <ValidationMessage validationResult={this.state.validationResult} inputName="email" text="You have to enter a valid e-mailaddress."></ValidationMessage>
                </div>
              </div>

              <div className="row">
              <div className="input-field col s12">
                               <label htmlFor="accountTypeSelect" className="active">Type of account</label>
              <select className="u-full-width" id="accountTypeSelect" ref="selectAccountType" onChange={this.handleAccountTypeChange} value={this.state.accountType}>
               <option value="Option 1">Option 1</option>
               <option value="Option 2">Option 2</option>
               <option value="Option 3">Option 3</option>
             </select>

            </div>
            </div>

              <div className="input-field col s12">
              <button className="btn-flat waves-effect waves-light lime" type="submit" value="Submit">Submit</button>
              { serverErrorMessage }
            </div>
        </form>);
    }
});

export default RequestAccountForm;
