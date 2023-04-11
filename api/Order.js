const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

//crear orden
router.post('/create', (req, res) => {

    let id_client = req.body.id_client;
    let id_carrier = req.body.id_carrier;
    let cant_garrafones = req.body.cant_garrafones;
    let precio = req.body.precio;
    let cuota_servicio = 5;
    let total = precio * cant_garrafones + cuota_servicio
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
//comenzar orden
router.put('/:orderId/ComenzarOrden', async (req, res) => {
    const orderId = req.params.orderId;
    const orden_status = req.body.orden_status;
  
    
    Order.findOneAndUpdate(
      { _id: orderId },
      { orden_status: orden_status }
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
      { orden_status: orden_status }
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


// Consultar orden - cliente
router.get("/read/client/:id", async (req, res) => {
    const id = req.params.id;

    Order.find({ id_client: id, orden_status: "PENDIENTE" }).then(result => {
        console.log('order');
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                message: "Order successfully obtained",
                data: result
            });
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error ocurred while checking for existing order!"
        })
    });

});
// Consultar orden - carrier
router.get("/read/carrier/:id", async (req, res) => {
    const id = req.params.id;

    Order.find({ id_carrier: id, orden_status: "PENDIENTE" }).then(result => {
        console.log('order');
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                message: "Order successfully obtained",
                data: result
            });
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error ocurred while checking for existing order!"
        })
    });

});
module.exports = router;