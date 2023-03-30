const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("./logger");
const { parse } = require("../utils/number");

let scrape = async (code) => {
  try {
    const { data } = await axios.get(
      `https://br.advfn.com/bolsa-de-valores/bovespa/${code}/cotacao`
    );
    const $ = cheerio.load(data);

    let valueString = $("[data-asc-param=CUR_PRICE]").text();
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
};

module.exports = scrape;
