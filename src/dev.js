require('dotenv/config');
require('./config/database');

const express = require('express');
const cors = require('cors');
const telegram = require('./config/telegram');
const welcome = require('./utils/welcome');

const app = express();

app.use(cors());
app.use(express.json());

telegram.onText(/\/start/gi, async (message) => {
    const chatId = message.chat.id;
    await telegram.sendMessage(chatId, `Olá ${message.chat.first_name}! Sou o bot do Monote 😀`);
    telegram.sendMessage(chatId, welcome(), {
        parse_mode: 'HTML'
    });
});
