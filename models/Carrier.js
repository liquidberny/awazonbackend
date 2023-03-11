const mongoose = require('mongoose');
const User = require("./User");

const CarrierSchema = new mongoose.Schema({
    vehiculo: {
        matricula: { type: String },
        id_transp: { type: Number },
        marca: { type: String },
        modelo: { type: String },
        año: { type: Number },
    },
    isActive: { type: Boolean, default: false},
    precioGarrafon: { type: Number },
    balance: { type: Number },
});

CarrierSchema.add(User.schema);
const Carrier = mongoose.model('Carrier', CarrierSchema)
module.exports = Carrier;
