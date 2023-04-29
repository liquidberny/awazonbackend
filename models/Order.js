const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    id_carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
    cant_garrafones: Number,
    precio: Number,
    cuota_servicio: Number,
    total: Number,
    orden_status: String,
    entrega_status: String,
    fecha_pedido: Date,
    fecha_entrega: Date,
    reseñaCarrier:{type: Boolean, default:false},
    reseñaCliente:{type: Boolean, default:false}
});
OrderSchema.pre('save', async function() {
    const carrier = await mongoose.model('Carrier').findById(this.id_carrier);
    this.precio = carrier.precioGarrafon;
    this.total = (this.precio * this.cant_garrafones) + this.cuota_servicio;
  });
const Order =  mongoose.model('Order', OrderSchema )
module.exports = Order;