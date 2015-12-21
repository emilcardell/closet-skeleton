const validationSummarizer = function(currentSum, validationResult) {
    currentSum.valid = currentSum.valid && validationResult.valid;
    currentSum.errors.push(validationResult.errors);
    return currentSum;
};

module.exports = validationSummarizer;
