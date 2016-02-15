import React from 'react';
import 'github/fetch';
import ValidationMessage from '/static/js/validationMessage';
import ValidationClassHelper from '/static/js/ValidationClassHelper';


const CreateOrganisationInvoicingForm = React.createClass({
    getInitialState() {
        return {
            validationResult: {}
        };
    },
    render() {
        return (<form noValidate>
          <div className="row">
              <h4>Invoicing info</h4>
              <p>We need some more information to get started.</p>

              <label htmlFor="fullName">Organisation number</label>
              <input className={ ValidationClassHelper("u-full-width", 'fullName', this.state.validationResult) } type="text" placeholder="Your full name here." id="fullName" onChange={this.handleFieldChange} value={this.state.fullName} required />
              <ValidationMessage validationResult={this.state.validationResult} inputName="fullName"></ValidationMessage>

            <label htmlFor="fullName">Street</label>
            <input className={ ValidationClassHelper("u-full-width", 'fullName', this.state.validationResult) } type="text" placeholder="Your full name here." id="fullName" onChange={this.handleFieldChange} value={this.state.fullName} required />
            <ValidationMessage validationResult={this.state.validationResult} inputName="fullName"></ValidationMessage>

            <label htmlFor="fullName">Zip code</label>
            <input className={ ValidationClassHelper("u-full-width", 'fullName', this.state.validationResult) } type="text" placeholder="Your full name here." id="fullName" onChange={this.handleFieldChange} value={this.state.fullName} required />
            <ValidationMessage validationResult={this.state.validationResult} inputName="fullName"></ValidationMessage>

            <label htmlFor="fullName">City</label>
            <input className={ ValidationClassHelper("u-full-width", 'fullName', this.state.validationResult) } type="text" placeholder="Your full name here." id="fullName" onChange={this.handleFieldChange} value={this.state.fullName} required />
            <ValidationMessage validationResult={this.state.validationResult} inputName="fullName"></ValidationMessage>

            <label htmlFor="fullName">Name of reciver</label>
            <input className={ ValidationClassHelper("u-full-width", 'fullName', this.state.validationResult) } type="text" placeholder="Your full name here." id="fullName" onChange={this.handleFieldChange} value={this.state.fullName} required />
            <ValidationMessage validationResult={this.state.validationResult} inputName="fullName"></ValidationMessage>



              <button className="btn-flat waves-effect waves-light lime" type="submit">Create account</button>
          </div>
        </form>);
    }
});



export default CreateOrganisationInvoicingForm;
