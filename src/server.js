require('dotenv/config');
require('./config/database');

const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');

const Stock = require('./models/Stock');
const Trigger = require('./models/Trigger');
const scrapper = require('./config/scraper');
const telegram = require('./config/telegram');
const logger = require('./config/logger');
const StockService = require('./services/stockService');
const TriggerService = require('./services/triggerService');
const welcome = require('./utils/welcome');
const { format } = require('./utils/number');

const app = express();

app.use(cors());
app.use(express.json());

telegram.onText(/\/start/g, async (message) => {
    const chatId = message.chat.id;
    await telegram.sendMessage(chatId, `Olá ${message.chat.first_name}! Sou o bot do Monote 😀`);
    telegram.sendMessage(chatId, welcome());
});

telegram.onText(/obrigado|valeu|tks|vlw/gmi, (message) => {
    const chatId = message.chat.id;
    telegram.sendMessage(chatId, `De nada ${message.chat.first_name}! Agradeça ao Thiago Furlan 😀`);
});

telegram.onText(/cotacao/gi, async (message) => {
    const chatId = message.chat.id;
    const content = message.text.split(' ');

    if (!message.text.match(/^cotacao\s{1}[a-z]{4}\d+[a-z]*$/gi)) {
        telegram.sendMessage(chatId, 'Comando inválido! Envie cotacao CODIGO Ex. cotacao ITSA4');
        return;
    }

    const stockService = new StockService();
    const stock = await stockService.find(content[1]);

    if (stock) {
        telegram.sendMessage(chatId, `${stock.code} está R$ ${stock.price}`);
    } else {
        telegram.sendMessage(chatId, 'Código do ativo não encontrado...');
    }
});

telegram.onText(/compra/gi, async (message) => {
    const chatId = message.chat.id;
    const content = message.text.split(' ');

    if (!message.text.match(/^compra\s{1}[a-z]{4}\d+[a-z]*\s{1}[0-9]+\.?\d*$/gi)) {
        telegram.sendMessage(chatId, 'Comando inválido! Envie \"compra CODIGO VALOR\" Ex. compra ITSA4 11');
        return;
    }

    const triggerService = new TriggerService();
    const stockService = new StockService();
    const stock = await stockService.find(content[1]);

    if (stock) {
        await triggerService.store({
            code: content[1],
            condition: '<',
            price: content[2]
        }, chatId);

        telegram.sendMessage(chatId, `Anotado! Vou te avisar quando estiver bom para compra`);
    } else {
        telegram.sendMessage(chatId, 'Código do ativo não encontrado...');
    }
});

telegram.onText(/venda/gi, async (message) => {
    const chatId = message.chat.id;
    const content = message.text.split(' ');

    if (!message.text.match(/^venda\s{1}[a-z]{4}\d+[a-z]*\s{1}[0-9]+\.?\d*$/gi)) {
        telegram.sendMessage(chatId, 'Comando inválido! Envie \"venda CODIGO VALOR\" Ex. venda ITSA4 11');
        return;
    }

    const triggerService = new TriggerService();
    const stockService = new StockService();
    const stock = await stockService.find(content[1]);

    if (stock) {
        await triggerService.store({
            code: content[1],
            condition: '>',
            price: content[2]
        }, chatId);

        telegram.sendMessage(chatId, `Anotado! Vou te avisar quando estiver bom para venda`);
    } else {
        telegram.sendMessage(chatId, 'Não consegui anotar, tenta novamente?');
    }
});

telegram.onText(/^lista$/gi, async (message) => {
    const chatId = message.chat.id;
    const firstName = message.chat.first_name;
    const triggerService = new TriggerService();
    const triggers = await triggerService.findByRecipient(chatId);
    
    if (!triggers) {
        telegram.sendMessage(chatId, `Oi ${firstName}! Ainda não tenho nenhum aviso de intenção. Cadastre um!`);
        return;
    }
    telegram.sendMessage(chatId, triggerService.toView(triggers));
});

schedule.scheduleJob('*/10 * * * * *', async () => {
    const stocks = await Stock.find();

    for (let stock of stocks) {
        let triggers = await Trigger.find({ code: stock.code, condition: '<', price: { $gt: stock.price } });
        if (triggers.length > 0) {
            for (let trigger of triggers) {
                telegram.sendMessage(trigger.recipient, `Tá na hora! ${trigger.code} tá saindo por ${format(stock.price)} 🤑`);
                await Trigger.deleteOne({ _id: trigger._id });
            }
        }
    }

    for (let stock of stocks) {
        let triggers = await Trigger.find({ code: stock.code, condition: '>', price: { $lt: stock.price } });
        if (triggers.length > 0) {
            for (let trigger of triggers) {
                telegram.sendMessage(trigger.recipient, `Olá! ${trigger.code} está em ${format(stock.price)}, você pediu para lembrar quando fosse uma boa hora para vender.`);
                await Trigger.deleteOne({ _id: trigger._id });
            }
        }
    }
});


// 30 minutes
schedule.scheduleJob('*/30 * * * *', async () => {
    logger.info('start scanning...');

    const stockService = new StockService();
    const stocks = await stockService.all();

    for (let stock of stocks) {
        const value = await scrapper(stock.code);

        if (value) {
            await stockService.store(stock.code, value);
        }

    }
});


app.get('/', async (req, res) => {
    const stocks = await Stock.find();
    if (stocks) {
        return res.status(200).json({ success: true, stocks });
    }
    return res.status(200).json({ success: false });
});

app.post('/triggers', async (req, res) => {
    const trigger = req.body;
    const result = await Trigger.create(trigger);
    if (result) {
        return res.status(201).json({ success: true, trigger: result });
    }
    return res.status(200).json({ success: false });
});

app.listen(process.env.PORT || 3000, () => console.log('monote-bot is alive!'));