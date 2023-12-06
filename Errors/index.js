const UnauthenticatedApiError = require('./unauthenticated');
const UNAUTHORIZEDApiError = require("./unauthorized");
const BadRequestApiError = require("./badRequest");
const NotFoundApiError = require("./notFound");

module.exports = {UNAUTHORIZEDApiError,UnauthenticatedApiError,BadRequestApiError, NotFoundApiError}
