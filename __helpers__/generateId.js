const crypto = require("crypto");

function generateUniquieId(){
    
    const randomUniqueId = crypto.randomUUID();
    return randomUniqueId;

}

module.exports = {generateUniquieId};