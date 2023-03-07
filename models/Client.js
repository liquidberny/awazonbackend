const mongoose = require('mongoose');
const { Decimal128 } = require('mongoose');
const User = require("./User");

const ClientSchema = new mongoose.Schema({
    direccion: {
        calle: { type: String },
        numero: { type: Number },
        ciudad: { type: String },
    },
    balance: Decimal128,
    horario: Date,
});

ClientSchema.add(User.schema);

const Client = mongoose.model('Client', ClientSchema)
module.exports = Client;