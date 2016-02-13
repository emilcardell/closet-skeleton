import React, { PropTypes } from 'react'
import 'github/fetch';
import CreateOrganisationUserForm from '/static/js/createOrganisation/createOrganisationUserForm';
import CreateOrganisationInvoicingForm from '/static/js/createOrganisation/createOrganisationInvoicingForm';
import { connect } from 'react-redux';
/*
const CreateOrganisationForm = React.createClass({
    render() {
        return (<div><CreateOrganisationUserForm /> <CreateOrganisationInvoicingForm /></div>);
    }
});
*/


const CreateOrganisationForm = ({ showInvoicingForm }) => {
    if (showInvoicingForm) {
        return (<div><CreateOrganisationInvoicingForm /></div>);
    }
    return (<div><CreateOrganisationUserForm /></div>);
};


CreateOrganisationForm.propTypes = {
    showInvoicingForm: PropTypes.bool.isRequired
};

export default connect((state) => state)(CreateOrganisationForm);
