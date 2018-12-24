const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const UserQrScanSchema = new Schema({
    date_scanned: {
        type: Date,
        default: Date.now()
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        unique: true
    },
    name: String,
    user_points: {
        type: Number,
        default: 0
    },

    off_codes: [
        {
            code: String,
            qr: {
                type: Schema.Types.ObjectId,
                ref: 'qrs',
                required: true
            },
            is_used: {
                type: Boolean,
                default: false
            }
        }
    ]


});

UserQrScanSchema.plugin(uniqueValidator);

module.exports = UserQrScan = mongoose.model('codeUsers', UserQrScanSchema);
