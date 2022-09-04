const mongoose = require('mongoose');

const HorseControl = mongoose.Schema({
    promoImage: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('HorseControl', HorseControl);