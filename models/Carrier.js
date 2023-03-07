const mongoose = require('mongoose');
const { Decimal128 } = require('mongoose');
const User = require("./User");

const CarrierSchema = new mongoose.Schema({
    vehiculo: {
        matricula: { type: String },
        id_transp: { type: Number },
        marca: { type: String },
        modelo: { type: String },
        año: { type: Number },
    },
    admin: { type: Boolean, default: false},
    precioGarrafon: Decimal128,
    balance: Decimal128,
});

CarrierSchema.add(User.schema);
const Carrier = mongoose.model('Carrier', CarrierSchema)
module.exports = Carrier;
