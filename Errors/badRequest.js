const CustomApiError = require('./customApiError');

class BadRequestApiError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = 400;
    }
}

module.exports = BadRequestApiError;