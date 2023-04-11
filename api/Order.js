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
    let entrega_status = req.body.entrega_status;
    let fecha_pedido = new Date().toISOString();
    let fecha_entrega = "";

    if (id_client == "" || id_carrier == "" || cant_garrafones == "" || cuota_servicio == "" ||
        orden_status == "" || entrega_status == "" || fecha_pedido == "" ) {
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
            entrega_status,
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

router.put('/:orderId/ComenzarOrden', async (req, res) => {
    const orderId = req.params.orderId;
    const orden_status = req.body.orden_status;
  
    
    Order.findOneAndUpdate(
      { _id: orderId },
      { _orden_status: orden_status }
    )
      .then(updatedP => {
        res.json({
          status: "SUCCESS",
          message: "Se ha cambiado la status de la orden",
          data: updatedP
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ 
          status:"ERROR",
          message:"No se a podido realizar el cambio de status" 
        });
      });
  });
//cancelar orden
router.put('/:orderId/Cancelarorden',async (req, res) => {
    const orderId = req.params.orderId;
    const orden_status = "CANCEL";
  
    Order.findOneAndUpdate(
      { _id: orderId },
      { _orden_status: orden_status }
    )
      .then(updatedP => {
        res.json({
          status: "SUCCESS",
          message: "Se ha cancelado la orden",
          data: updatedP
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ 
          status:"ERROR",
          message:"No se a podido cancelar la orden" 
        });
      });

});
module.exports = router;