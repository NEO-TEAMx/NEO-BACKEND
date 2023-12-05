const CustomApiError = require('./customApiError');
const {StatusCodes} = require("http-status-codes")

class UnauthenticatedApiError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedApiError;