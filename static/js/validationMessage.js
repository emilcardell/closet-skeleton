import React from 'react';
import _ from 'underscore';

const ValidationMessage = React.createClass({
    render() {
        let validationResult = this.props.validationResult;
        if (!validationResult || validationResult.valid) {
            return null;
        }

        let inputName = this.props.inputName;
        let text = this.props.text;

        let foundErrors = _(validationResult.errors).find((error) => {
            return error.field === inputName;
        });

        if (foundErrors.length > 0) {
            if (!text) {
                text = '';
                foundErrors.forEach((error) => {
                    text += error;
                });
            }
        }

        return (<div className="validation-error-message">{{ text }}</div>);
    }
});

export default ValidationMessage;
