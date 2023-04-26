const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String,
    email: String,
    contrasena: String,
    num_contacto: Number,
    calificacion: Number,
    reseña:Array,
});
const User =  mongoose.model('User', UserSchema )
module.exports = User;