const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Client = require("../models/Client")
//crear orden
router.post("/create", (req, res) => {
    let id_client = req.body.id_client;
    let id_carrier = "";
    let cant_garrafones = req.body.cant_garrafones;
    let precio = req.body.precio;
    let cuota_servicio = 5;
    let total = cant_garrafones * precio + cuota_servicio;
    let orden_status = "pending";
    let entrega_status = "pending";
    let fecha_pedido = new Date().toISOString();
    let fecha_entrega = "";

    if (
        id_client == "" ||
        id_carrier == "" ||
        cant_garrafones == "" ||
        entrega_status == "" ||
        fecha_pedido == ""
    ) {
        res.json({
            status: "FAILED",
            message: "Empty input fields!",
        });
    } else {
        // Try to create new order
        const newOrder = new Order({
            id_client,
            id_carrier,
            cant_garrafones,
            precio,
            cuota_servicio,
            total,
            orden_status,
            entrega_status,
            fecha_pedido,
            fecha_entrega,
        });

        newOrder
            .save()
            .then((result) => {
                res.json({
                    status: "SUCCESS",
                    message: "Order created successfully!",
                    data: result,
                });
            })
            .catch((err) => {
                res.json({
                    status: "FAILED",
                    message: "An error occurred while creating order",
                });
            });
    }
});
//CAMBIAR ORDEN STATUS
router.put("/:orderId/orden_status", async (req, res) => {
    const orderId = req.params.orderId;
    const orden = req.query.orden;
    Order.findOneAndUpdate({ _id: orderId }, { orden_status: orden })
        .then((updatedP) => {
            updatedP.orden_status = orden;
            res.json({
                status: "SUCCESS",
                message: "Se ha cambiado la status de la orden",
                data: updatedP,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                status: "ERROR",
                message: "No se a podido realizar el cambio de status",
            });
        });
});

//CAMBIAR ENTREGA STATUS
router.put("/:orderId/entrega_status", async (req, res) => {
    const orderId = req.params.orderId;
    const id_carrier = req.body.id_carrier;
    const newOrder = req.query.entrega; // Obtener el valor del query "entrega"
    Order.findOneAndUpdate({ _id: orderId }, { entrega_status: newOrder, id_carrier: id_carrier })
        .then((updatedP) => {
            updatedP.entrega_status = newOrder;
            res.json({
                status: "SUCCESS",
                message: "Se ha cambiado la status de la orden",
                data: updatedP,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                status: "ERROR",
                message: "No se a podido realizar el cambio de status",
            });
        });
});


//get solicitudes
router.get("/read", async (req, res) => {
    Order.find({}, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.json({
            status: "SUCCESS",
            message: "Order successfully obtained",
            data: result
        });
    });
});
// Consultar orden por id
router.get("/read/:id", async (req, res) => {
    const id = req.params.id;

    Order.find({ _id: id }).then(result => {
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                message: "Order successfully obtained",
                data: result
            });
        } else {
            res.status(404).json({
                status:"FAILED",
                message: "Unable to find order related to the provided Order ID."
            })
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error ocurred while checking for existing order!"
        })
    });

});
// Consultar orden - cliente
router.get("/read/client/:id", async (req, res) => {
    const id = req.params.id;

    Order.find({ id_client: id }).then(result => {
        console.log('order');
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                message: "Order successfully obtained",
                data: result
            });
        } else {
            res.status(404).json({
                status:"FAILED",
                message:"Unable to find orders related to the provided CLient ID."
            })
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

    Order.find({ id_carrier: id }).then(result => {
        console.log('order');
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                message: "Order successfully obtained",
                data: result
            });
        } else {
            res.status(404).json({
                status:"FAILED",
                message:"Unable to find orders related to the provided Carrier ID."
            })
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error ocurred while checking for existing order!"
        })
    });

});
// consultar solicitudes de pedidos
router.get("/pending", async (req, res) => {
    Order.find({ orden_status: "pending", entrega_status: "pending" }).then(result => {
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                message: "Orders successfully obtained",
                data: {
                    order: result,
                }
            });
        } else {
            res.status(404).json({
                status:"FAILED",
                message:"Unable to find pending orders."
            })
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error ocurred while checking for existing order!"
        })
    });

});
// Consultar pedidos en curso 
router.get("/accepted/:id", async (req, res) => {
    const id = req.params.id;
    Order.find({ id_carrier: id, orden_status: "accepted", entrega_status: "accepted" }).then(result => {
        if (result.length !== 0) {
            res.json({
                status: "SUCCESS",
                message: "Delivery in course successfully obtained",
                data: result
            });
        } else {
            res.status(404).json({
                status:"FAILED",
                message:"Unable to find orders in course related to the provided ID."
            })
        }
    }).catch(err => {
        console.log(err);
        res.json({
            status: "FAILED",
            message: "An error ocurred while checking for existing delivery!"
        })
    });

});


module.exports = router;