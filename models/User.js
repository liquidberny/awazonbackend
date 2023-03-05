const { Decimal128 } = require('mongoose');
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: String,
    apellidos: String,
    email: String,
    password: String,
    num_contacto: Number,
    calificacion: Decimal128,  
});
const User =  mongoose.model('User', UserSchema )
module.exports = User;