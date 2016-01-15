import React from 'react';
import iz from 'emilcardell/iz';
import 'github/fetch';

const CreateUserForm = React.createClass({
    getInitialState() {
        return { email: '' };
    },
    handleEmailChange: function(event) {
        this.setState( { email: event.target.value } );
    },
    handleSubmit(e) {
        e.preventDefault();

        let validationResult = iz('humbug').required().email();
        if (!validationResult.valid) {
            //show validation errors.
        }
        console.log(validationResult);

        //validate
        //sendToServer
        //showMessage
    },
    render() {
        return (<form onSubmit={this.handleSubmit}>
          <div className="row">
              <label htmlFor="exampleEmailInput">Your email</label>
              <input className="u-full-width" type="email" placeholder="test@mailbox.com" id="exampleEmailInput" onChange={this.handleEmailChange} value={this.state.email} required />
              <label htmlFor="exampleRecipientInput">Type of account</label>
             <select className="u-full-width" id="exampleRecipientInput">
               <option value="Option 1">Option 1</option>
               <option value="Option 2">Option 2</option>
               <option value="Option 3">Option 3</option>
             </select>
              <input className="button-primary u-full-width" type="submit" value="Submit" />
          </div>
        </form>);
    }
});

export default CreateUserForm;
