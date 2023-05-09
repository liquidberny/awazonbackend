const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  id_client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  id_carrier: { type: mongoose.Schema.Types.ObjectId, ref: "Carrier" },
  cant_garrafones: Number,
  precio: Number,
  cuota_servicio: Number,
  total: Number,
  orden_status: String,
  entrega_status: String,
  fecha_pedido: Number,
  fecha_entrega: Number,
  fecha_programado: Number,
  reseñaCarrier: { type: Boolean, default: false },
  reseñaCliente: { type: Boolean, default: false },
});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
