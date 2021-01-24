const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('./logger');
const { parse } = require('../utils/number');

let scrape = async (code) => {
    try {
        const { data } = await axios.get(`https://www.infomoney.com.br/${code}`);
        const $ = cheerio.load(data);

        let valueString = $('.line-info > .value > p').text();
        let value = parse(valueString);

        if (value) {
            return value;
        } else {
            return false;
        }
    } catch (error) {
        logger.error(error);
        return false;
    }
}

module.exports = scrape;