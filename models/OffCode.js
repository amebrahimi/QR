const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OffCodeSchema = new Schema({
    code: {
        type: String,
        unique: true
    },
    is_used: {
        type: Boolean,
        default: false
    }
});

module.exports = OffCode = mongoose.model('off_codes', OffCodeSchema);