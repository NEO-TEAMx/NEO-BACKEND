const CustomApiError = require('./customApiError');
const {StatusCodes} = require("http-status-codes");

class UNAUTHORIZEDApiError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UNAUTHORIZEDApiError;