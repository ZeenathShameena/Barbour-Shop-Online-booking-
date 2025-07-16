const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        title: String,
        price: String
    }
);

module.exports = mongoose.model('categories', userSchema);