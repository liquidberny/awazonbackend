const mongoose = require('mongoose');
const User = require("./User");

const ClientSchema = new mongoose.Schema({
    direccion: {
        calle: { type: String },
        numero: { type: Number },
        ciudad: { type: String },
    },
    
    balance: { type: Number },
    horario: {
        dias:[{type: Number}],
        hora_inicial:{type: Number},
        hora_final:{type: Number},
    },
});

ClientSchema.add(User.schema);

const Client = mongoose.model('Client', ClientSchema)
module.exports = Client;