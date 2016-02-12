const createOrganisation = (state, action) => {
    switch (action.type) {
        case 'LOGIN_INFO_OK':
            return {
                showInvoicingForm: true
            };
        default:
            return state;
    }
};

export default createOrganisation;
