import React, { PropTypes } from 'react'
import 'github/fetch';
import CreateOrganisationUserForm from '/static/js/createOrganisation/createOrganisationUserForm';
import CreateOrganisationInvoicingForm from '/static/js/createOrganisation/createOrganisationInvoicingForm';
import { connect } from 'react-redux';
import FetchAccountRequest from '/static/js/createOrganisation/actions/fetchAccountRequest'
/*
const CreateOrganisationForm = ({ showInvoicingForm }) => {
    if (showInvoicingForm) {
        return (<div><CreateOrganisationInvoicingForm /></div>);
    }
    return (<div><CreateOrganisationUserForm /></div>);
};*/

const CreateOrganisationForm = React.createClass({
    propTypes: {
        showInvoicingForm: PropTypes.bool.isRequired
    },
    componentDidMount() {
        this.props.loadAccountRequest('meh');
    },
    render() {
        if (this.props.showInvoicingForm) {
            return (<div><CreateOrganisationInvoicingForm /></div>);
        }
        return (<div><CreateOrganisationUserForm /></div>);
    }
});
/*
CreateOrganisationForm.propTypes = {
    showInvoicingForm: PropTypes.bool.isRequired
};*/


export default connect((state) => state,
(dispatch) => {
    return {
        loadAccountRequest: (emailAuthId) => {
            console.log('displatch');
            dispatch(FetchAccountRequest(emailAuthId));
        }
    }
})(CreateOrganisationForm);
