const Trigger = require('../models/Trigger');
const { format } = require('../utils/number');
const { upper } = require('../utils/string');

class TriggerService {

    async find(code) {
        if (code) {
            return await Trigger.find();
        }
        return await Trigger.find({ code });
    }

    async findByRecipient(recipient) {
        return await Trigger.find({ recipient });
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

    toView(triggers) {
        let result = ``;
        if (!triggers) {
            return result;
        }
        for (let trigger of triggers) {
            if (trigger.condition === '>') {
                result += `Vender ${trigger.code} em ${format(trigger.price)}\n`;
                continue;
            }
            result += `Comprar ${trigger.code} em ${format(trigger.price)}\n`;
        }
        return result;
    }

}

module.exports = TriggerService;