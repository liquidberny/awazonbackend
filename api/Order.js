const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

//codigo de endpoints aqui: 

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