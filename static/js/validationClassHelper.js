import _ from 'underscore';

const ValidationClassHelper = function(mainClass, inputName, validationResult) {
    if (validationResult.valid) {
        return mainClass;
    }

    let foundErrors = _(validationResult.errors).find((error) => {
        return error.field === inputName;
    });

    if (foundErrors.length > 0) {
        return mainClass + ' ' + mainClass + '--invalid';
    }

    return mainClass;
};

export default ValidationClassHelper;
