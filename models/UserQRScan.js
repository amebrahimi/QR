const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserQrScanSchema = new Schema({
    date_scanned: {
        type: Date,
        default: Date.now()
    },
    email: String,
    phone: String,
    name: String,
    user_points: {
        type: Number,
        default: 0
    },
    qr: {
        type: Schema.Types.ObjectId,
        ref: 'qrs'
    }
});
