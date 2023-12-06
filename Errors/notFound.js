const CustomApiError = require('./customApiError');

class NotFoundApiError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = 404;
    }
}

module.exports = NotFoundApiError;