const Trigger = require('../models/Trigger');
const { upper } = require('../utils/string');

class TriggerService {

    async find(code) {

    }

    async store(trigger, chatId) {
        await Trigger.create({
            code: upper(trigger.code),
            condition: trigger.condition,
            price: Number(trigger.price),
            channel: 'telegram',
            recipient: chatId
        });
    }

}

module.exports = TriggerService;