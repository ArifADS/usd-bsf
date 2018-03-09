const mongoose = require('mongoose');

const PriceHistory = mongoose.model('PriceHistory', {
    dt: Number,
    simadi: Number,
    date: Number
});

module.exports = {
    PriceHistory
}