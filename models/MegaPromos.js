const mongoose = require('mongoose');

const Promos = mongoose.Schema({
    promoImage: {
        type: String,
        require: true
    },
    link: {
        type: String,
        require: true
    },
    promoTitle: {
        type: String,
        require: true
    },
    promoImageSquare: {
        type: String,
        require: true
    },
});

module.exports = mongoose.model('MegaPromo', Promos);