const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserQrScanSchema = new Schema({
    date_scanned: {
        type: Date,
        default: Date.now()
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    name: String,
    user_points: {
        type: Number,
        default: 0
    },

    off_codes: [
        {
            qr: {
                type: Schema.Types.ObjectId,
                ref: 'qrs',
                required: true
            },
            off_codes: {
                type: Schema.Types.ObjectId,
                ref: 'off_codes',
                required: true
            }
        }
    ]


});


module.exports = UserQrScan = mongoose.model('codeUsers', UserQrScanSchema);
