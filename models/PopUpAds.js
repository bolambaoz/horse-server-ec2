const mongoose = require('mongoose');

const PopUpAds = mongoose.Schema({
      popUpImage: {
        type: String,
        require: true
    },
    popUplink: {
        type: String,
        require: true
    },
    popUpTitle: {
      type: String,
      require: true
   },
   popUpStatus: {
      type: Boolean,
      require: true
   }
});

module.exports = mongoose.model('PopUpAd', PopUpAds);