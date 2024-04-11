const axios = require('axios');

async function getNeoToUsdtRate(){
    try {
        // const response = await axios.get('https://coingecko.com/api/v3/simple/price', {
        //     params:{
        //         ids:'neo',
        //         vs_currencies: 'usd'
        //     },
        // });
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=neo&vs_currencies=usd");
        const neoToUsdt = response.data.neo.usd;
        return neoToUsdt;
    } catch (error) {
        console.error('Error fetching conversion rate:', error.message);
        return error;
    }
}

module.exports = {getNeoToUsdtRate};