const ValidationClassHelper = function(mainClass, inputName, validationResult) {

    if (validationResult[inputName]) {
        return mainClass + ' ' + mainClass + '--invalid';
    }

    return mainClass;
};

export default ValidationClassHelper;
