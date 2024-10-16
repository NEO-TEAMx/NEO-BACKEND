const axios = require('axios');
const {BadRequestApiError} = require("../Errors");

async function getNeoToUsdtRate(){
    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=usd");
        const neoToUsdt = response.data.neo.usd;
        return neoToUsdt;
    } catch (error) {
        console.error('Error fetching conversion rate:', error.message);
        // return error;
        throw new BadRequestApiError("Error occurred. Try again!!")
    }
}

module.exports = {getNeoToUsdtRate};