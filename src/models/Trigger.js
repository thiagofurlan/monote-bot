const mongoose = require('mongoose');

const { Schema } = mongoose;

const TriggerSchema = new Schema({
    code: String,
    condition: String,
    price: Number,
    channel: String,
    recipient: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trigger', TriggerSchema);
