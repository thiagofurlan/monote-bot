const Stock = require('../models/Stock');
const scrapper = require('../config/scraper');
const { upper } = require('../utils/string');

class StockService {

    async all() {
        return await Stock.find();
    }

    async find(code) {
        const stock = await Stock.findOne({ code: upper(code) });

        if (stock) {
            return stock;
        }

        const value = await scrapper(upper(code));

        if (value) {
            await this.store(upper(code), value)
            return await Stock.findOne({ code: upper(code) });
        }

        return false;
    }

    async store(code, price) {
        return await Stock.updateOne({
            code
        }, {
            code: upper(code),
            price
        }, {
            upsert: true
        });
    }

}

module.exports = StockService;