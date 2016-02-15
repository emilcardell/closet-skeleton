export default function fetchAccountRequest(emailAuthId) {
    console.log('Action')
    return {
        type: 'FETCH_ACCOUNT',
        payload: {
            promise: fetch('/api/user/createOrganisation/' + emailAuthId).then((data)=> {console.log('MEH')}),
            data: { emailAuthId: emailAuthId }
        }
    };
}
