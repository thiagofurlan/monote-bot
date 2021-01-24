const mongoose = require('mongoose');

const { Schema } = mongoose;

const StockSchema = new Schema({
  code: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stock', StockSchema);
