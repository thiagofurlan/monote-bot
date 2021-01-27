require('dotenv/config');

const telegram = require('./config/telegram');

telegram.onText(/^oi$/gi, async (message) => {
    const chatId = message.chat.id;
    await telegram.sendMessage(chatId, `olá ${message.from.first_name}`);
});
