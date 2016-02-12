import React from 'react';
import 'github/fetch';
import CreateOrganisationUserForm from '/static/js/createOrganisationUserForm';
import CreateOrganisationInvoicingForm from '/static/js/createOrganisationInvoicingForm';


const CreateOrganisationForm = React.createClass({
    render() {
        return (<div><CreateOrganisationUserForm /> <CreateOrganisationInvoicingForm /></div>);
    }
});

export default CreateOrganisationForm;
