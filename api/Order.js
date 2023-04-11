const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

//crear orden
router.post('/create', (req, res) => {
    let id_client = req.body.id_client;
    let id_carrier = req.body.id_carrier
    let cant_garrafones = req.body.cant_garrafones
    let cuota_servicio = req.body.cuota_servicio
    let total = req.body.total
    let orden_status = req.body.orden_status;
    let entraga_status = req.body.entraga_status;
    let fecha_pedido = req.body.fecha_pedido;
    let fecha_entrega = req.body.fecha_entrega;

    if (id_client == "" || id_carrier == "" || cant_garrafones == "" || cuota_servicio == "" ||
        orden_status == "" || entraga_status == "" || fecha_pedido == "" || fecha_entrega == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else {
        // Try to create new order
        const newOrder = new Order({
            id_client,
            id_carrier,
            cant_garrafones,
            cuota_servicio,
            total,
            orden_status,
            entraga_status,
            fecha_pedido,
            fecha_entrega,
        });

        newOrder.save().then(result => {
            res.json({
                status: "SUCCESS",
                message: "Order created successfully!",
                data: result
            })
        })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while creating order"
                })
            })
    }
});

module.exports = router;