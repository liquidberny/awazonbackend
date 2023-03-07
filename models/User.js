const { Decimal128 } = require('mongoose');
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    email: String,
    contrasena: String,
    num_contacto: Number,
    calificacion: Decimal128,  
});
const User =  mongoose.model('User', UserSchema )
module.exports = User;