const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    id_client: String,
    id_carrier: String,
    cant_garrafones: Number,
    cuota_servicio: Number,
    total: Number,
    orden_status: String,
    entraga_status: String,
    fecha_pedido: Date,
    fecha_entrega: Date,
});
const Order =  mongoose.model('Order', OrderSchema )
module.exports = Order;