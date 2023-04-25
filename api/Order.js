const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Client = require("../models/Client");
const Carrier = require("../models/Carrier");
var ObjectId = require("mongodb").ObjectId;

//crear orden
router.post("/create", (req, res) => {
  let id_client = req.body.id_client;
  let id_carrier = req.body.id_carrier;
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
    entrega_status == ""
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
  Order.findOneAndUpdate(
    { _id: orderId },
    { entrega_status: newOrder, id_carrier: id_carrier }
  )
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

// aceptar solicitud de pedido
router.put("/:orderId/accept-request", async (req, res) => {
  const orderId = req.params.orderId;
  const carrier = req.body.carrier;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "accepted",
      entrega_status: "accepted",
      id_carrier: ObjectId(carrier),
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha aceptado la solicitud de la orden"
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "ERROR",
        message: "Ocurrió un error al aceptar la solicitud",
      });
    });
});

// rechazar solicitud de pedido
router.put("/:orderId/decline-request", async (req, res) => {
  const orderId = req.params.orderId;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "declined",
      entrega_status: "pending"
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha rechazado la solicitud de la orden"
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "ERROR",
        message: "Ocurrió un error al rechazar la solicitud",
      });
    });
});

// comenzar entrega
router.put("/:orderId/start-delivery", async (req, res) => {
  const orderId = req.params.orderId;
  const carrier = req.body.carrier;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "accepted",
      entrega_status: "accepted",
      id_carrier: ObjectId(carrier),
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha comenzado la entrega de la orden"
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "ERROR",
        message: "Ocurrió un error al comenzar la entrega",
      });
    });
});

// cancelar entrega
router.put("/:orderId/cancel-delivery", async (req, res) => {
  const orderId = req.params.orderId;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "accepted",
      entrega_status: "pending",
      id_carrier: null,
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha cancelado la entrega de la orden"
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "ERROR",
        message: "Ocurrió un error al cancelar la entrega",
      });
    });
});

// finalizar entrega
router.put("/:orderId/finish-delivery", async (req, res) => {
  const orderId = req.params.orderId;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "accepted",
      entrega_status: "done",
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha cancelado la entrega de la orden"
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "ERROR",
        message: "Ocurrió un error al cancelar la entrega",
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
      data: result,
    });
  });
});
// Consultar orden por id
router.get("/read/:id", async (req, res) => {
  const id = req.params.id;

  Order.findById(id)
    .then(async (order) => {
      if (!order) {
        res.json({
          status: "FAILED",
          message: "Order not found",
        });
        return;
      }

      // Obtener la dirección y horario del cliente asociado a la orden
      const clientId = order.id_client;
      const client = await Client.findById(clientId).select(
        "direccion horario"
      );

      res.json({
        status: "SUCCESS",
        message: "Order successfully obtained",
        data: {
          ...order.toObject(),
          direccion: client.direccion,
          horario: client.horario,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error occurred while obtaining the order",
      });
    });
});

// Consultar orden - cliente
router.get("/read/client/:id", async (req, res) => {
  const id = req.params.id;

  Order.find({ id_client: id })
    .then((result) => {
      console.log("order");
      if (result.length !== 0) {
        res.json({
          status: "SUCCESS",
          message: "Order successfully obtained",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message: "Unable to find orders related to the provided CLient ID.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error ocurred while checking for existing order!",
      });
    });
});
// Consultar orden - carrier
router.get("/read/carrier/:id", async (req, res) => {
  const id = req.params.id;

  Order.find({ id_carrier: id })
    .then((result) => {
      console.log("order");
      if (result.length !== 0) {
        res.json({
          status: "SUCCESS",
          message: "Order successfully obtained",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message: "Unable to find orders related to the provided Carrier ID.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error ocurred while checking for existing order!",
      });
    });
});

// consultar solicitudes de pedidos
router.get("/requests", async (req, res) => {
  try {
    const orders = await Order.find({
      orden_status: "pending",
      entrega_status: "pending",
    });

    for (let i = 0; i < orders.length; i++) {
      const client = await Client.findById(orders[i].id_client);
      orders[i].id_client = client;
    }

    if (orders.length !== 0) {
      res.json({
        status: "SUCCESS",
        message: "Orders successfully obtained",
        data: orders,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "Unable to find pending orders.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "An error ocurred while checking for existing order!",
    });
  }
});

// consultar pedidos pendientes
router.get("/pending", async (req, res) => {
  try {
    const orders = await Order.find({
      orden_status: "accepted",
      entrega_status: "pending",
    });

    for (let i = 0; i < orders.length; i++) {
      const client = await Client.findById(orders[i].id_client);
      orders[i].id_client = client;
    }

    if (orders.length !== 0) {
      res.json({
        status: "SUCCESS",
        message: "Orders successfully obtained",
        data: orders,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "Unable to find pending orders.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "An error ocurred while checking for existing order!",
    });
  }
});

// consultar pedidos en curso
router.get("/ongoing/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const orders = await Order.find({
      id_carrier: id,
      orden_status: "accepted",
      entrega_status: "accepted",
    });

    for (let i = 0; i < orders.length; i++) {
      const client = await Client.findById(orders[i].id_client);
      orders[i].id_client = client;
      const carrier = await Carrier.findById(orders[i].id_carrier);
      orders[i].id_carrier = carrier;
    }

    if (orders.length !== 0) {
      res.json({
        status: "SUCCESS",
        message: "Orders successfully obtained",
        data: orders,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "Unable to find pending orders.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "An error ocurred while checking for existing order!",
    });
  }
});

// Consultar pedidos en curso
router.get("/accepted/:id", async (req, res) => {
  const id = req.params.id;
  Order.find({
    id_carrier: id,
    orden_status: "accepted",
    entrega_status: "accepted",
  })
    .then((result) => {
      if (result.length !== 0) {
        res.json({
          status: "SUCCESS",
          message: "Delivery in course successfully obtained",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message:
            "Unable to find orders in course related to the provided ID.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error ocurred while checking for existing delivery!",
      });
    });
});
//encontrar por colonia
router.get("/readbycolonia", async (req, res) => {
  const colony = req.query.colony;
  if (!colony) {
    return res.status(400).json({
      status: "FAILED",
      message: "Please provide a valid colony name",
    });
  }

  try {
    const clients = await Client.find({ "direccion.colonia": colony });
    const clientIds = clients.map((client) => client._id);

    const orders = await Order.find({ id_client: { $in: clientIds } });

    return res.json({
      status: "SUCCESS",
      message: `Orders successfully obtained for clients in ${colony} colony`,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching orders",
      error: err,
    });
  }
});
//encontrar por dias
router.get("/readbydias", async (req, res) => {
  const day = Number(req.query.day);
  if (!day) {
    return res.status(400).json({
      status: "FAILED",
      message: "Please provide a valid day",
    });
  }

  try {
    const clients = await Client.find({ "horario.dias": { $in: [day] } });
    const clientIds = clients.map((client) => client._id);

    const orders = await Order.find({ id_client: { $in: clientIds } });

    return res.json({
      status: "SUCCESS",
      message: `Orders successfully obtained for clients with delivery on ${day}`,
      data: orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching orders",
      error: err,
    });
  }
});
//leer utilizando colonia y dia a la vez
router.get("/readbycoloniaydia", async (req, res) => {
  let colonia = req.body.colonia;
  let dias = req.body.dias;

  if (!colonia && !dias) {
    return res.status(400).json({
      status: "FAILED",
      message: "Please provide a valid colony name or day",
    });
  }

  try {
    let clientIds = [];
    if (colonia) {
      const clientsByColony = await Client.find({
        "direccion.colonia": colonia,
      });
      clientIds = clientsByColony.map((client) => client.id);
    }
    if (dias) {
      const clientsByDay = await Client.find({
        "horario.dias": { $in: [dias] },
      });
      const clientIdsByDay = clientsByDay.map((client) => client.id);
      clientIds =
        clientIds.length > 0
          ? clientIds.filter((id) => clientIdsByDay.includes(id))
          : clientIdsByDay;
    }
    const orders = await Order.find({ id_client: { $in: clientIds } });

    return res.json({
      status: "SUCCESS",
      message: "Orders successfully obtained",
      data: orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "FAILED",
      message: "An error occurred while fetching orders",
      error: err,
    });
  }
});

// Obtener ordenes finalizadas - Carrier
router.get("/read/carrier/history/:id", async (req, res) => {
  const id = req.params.id;

  Order.find({ id_carrier: id, orden_status: "accepted",entrega_status: "done" })
    .then((result) => {
      console.log("order");
      if (result.length !== 0) {
        res.json({
          status: "SUCCESS",
          message: "Order successfully obtained",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message: "Unable to find finished orders related to the provided Carrier ID.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error ocurred while checking for finished orders!",
      });
    });
});

// Visualizar historial del cliente
router.get("/read/client/history/:id", async (req, res) => {
  const id = req.params.id;

  Order.find({ id_client: id, orden_status: "accepted",entrega_status: "done"})
    .then((result) => {
      console.log(result);
      if (result.length !== 0) {
        res.json({
          status: "SUCCESS",
          message: "History successfully obtained",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message: "Unable to find history related to the provided Client ID.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error ocurred while checking history client",
      });
    });
});

module.exports = router;
