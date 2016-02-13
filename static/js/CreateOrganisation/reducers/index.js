const createOrganisation = (state, action) => {
    console.log(action.type);
    switch (action.type) {
        case 'LOGIN_INFO_OK':
            return {
                showInvoicingForm: true
            };
        default:
            return { showInvoicingForm: false };
    }
};

export default createOrganisation;
