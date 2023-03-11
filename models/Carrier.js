const mongoose = require('mongoose');
const User = require("./User");

const CarrierSchema = new mongoose.Schema({
    vehiculo: {
        matricula: { type: String },
        marca: { type: String },
        modelo: { type: String },
        color: { type: String },
    },
    isActive: { type: Boolean, default: false},
    precioGarrafon: { type: Number },
    balance: { type: Number },
});

CarrierSchema.add(User.schema);
const Carrier = mongoose.model('Carrier', CarrierSchema)
module.exports = Carrier;
