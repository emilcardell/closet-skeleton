import React from 'react';

const ValidationMessage = React.createClass({
    render() {
        let validationResult = this.props.validationResult;
        if (!validationResult || validationResult.valid) {
            return null;
        }

        let inputName = this.props.inputName;
        if (!validationResult[inputName]) {
            return null;
        }

        let fieldResult = validationResult[inputName];
        let text = [];
        fieldResult.forEach((errorMessage) => {
            text.push(<span className="validation-errors__message" key={errorMessage}>{ errorMessage }</span>);
        });

        return (<div className="validation-errors">{ text }</div>);
    }
});

export default ValidationMessage;
