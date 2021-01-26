const axios = require('axios');

const find = async (code) => {
    try {
        const { data } = await axios.get(`https://br.tradingview.com/symbols/BMFBOVESPA-${code}`);
        return {
            success: true,
            data
        };
    } catch (error) {
        if (error.response.status === 404) {
            return {
                success: false,
                message: 'Código do ativo não encontrado'
            };
        }
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = find;