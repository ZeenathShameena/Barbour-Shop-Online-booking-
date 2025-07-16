const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        default: "admin"
    },
    name: {
        type: String,
    },
    mobile: {
        type: String
    },
    address: {
        type: String
    },

});

module.exports = mongoose.model('Admin', adminSchema);
