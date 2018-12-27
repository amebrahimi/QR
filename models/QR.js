const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QrSchema = new Schema({

    generated_hash: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        default: 1
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    expire_date: {
        type: Date,
        required: true
    },
    max_use: {
        type: Number,
        default: 100
    },
    remaining_use: {
        type: Number,
        default: 100
    },
    scanned_times: {
        type: Number,
        default: 0
    },
    off_codes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'off_codes'
        }]
});

module.exports = Qr = mongoose.model('qrs', QrSchema);
