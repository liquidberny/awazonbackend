const schedule = require("node-schedule");
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Client = require("../models/Client");
const Carrier = require("../models/Carrier");
var ObjectId = require("mongodb").ObjectId;

const jobs = {};

// Finds the orders marked as scheduled and creates their corresponding scheduled job
// This is a workaround for whenever the API is re-deployed or restarted, so we don't
// just lose all of the scheduled tasks
Order.find({ orden_status: "scheduled" }).then((result) => {
  for (const order of result) {
    if (jobs[order._id]) continue;

    if (order["fecha_programado"]) {
      const job = schedule.scheduleJob(
        new Date(order["fecha_programado"]),
        setOrderStatus.bind(null, order._id, "pending")
      );

      jobs[order._id] = job;
      // console.log("Added task");
    }
  }
  // console.log(jobs);
});

// Helper functions
const scheduleOrder = (orderId, date) => {
  const job = schedule.scheduleJob(
    date,
    setOrderStatus.bind(null, orderId, "pending")
  );

  jobs[orderId] = job;

  return date;
};

const setOrderStatus = async (orderId, status = "pending") => {
  await Order.findOneAndUpdate(
    { _id: orderId },
    { orden_status: status, entrega_status: status }
  );
};

const flattenDate = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addMillis = (date, factor) => date.getTime() + factor * 3600000;

const getDayOfWeek = () => new Date().getDay();

const getNearestIndex = (clientDays) => {
  for (const day of clientDays) {
    if (getDayOfWeek() < day) {
      return day;
    }
  }

  return clientDays[0];
};

const getNearestDate = (clientSched) => {
  const currentDate = new Date();
  const flatDate = flattenDate(currentDate);

  if (
    clientSched.dias.includes(flatDate.getDay()) &&
    addMillis(flatDate, clientSched.hora_inicial) > currentDate.getTime()
  ) {
    return new Date(addMillis(flatDate, clientSched.hora_inicial));
  }

  const tempDate = flattenDate(new Date());
  tempDate.setDate(
    tempDate.getDate() +
      ((getNearestIndex(clientSched.dias) + 7 - tempDate.getDay()) % 7 || 7)
  );

  return new Date(addMillis(tempDate, clientSched.hora_inicial));
};

// const getOrder = async (id) => {
//   const order = await Order.findById(id);
//   const client = await Client.findById(order.id_client);
//   order.id_client = client;
//   const carrier = await Carrier.findById(order.id_carrier);
//   order.id_carrier = carrier;

//   return order;
// };

const isOnSchedule = (clientSched) => {
  console.log(getDayOfWeek());
  console.log(clientSched.dias);
  if (!clientSched.dias.includes(getDayOfWeek())) return false;

  const currentDate = new Date();
  const flatDate = flattenDate(currentDate);
  const initialTime = addMillis(flatDate, clientSched.hora_inicial);
  const finalTime = addMillis(flatDate, clientSched.hora_final);

  if (
    currentDate.getTime() >= initialTime &&
    currentDate.getTime() < finalTime
  ) {
    return true;
  }

  return false;
};

// Router
//crear orden
router.post("/create", async (req, res) => {
  let id_client = req.body.id_client;
  let cant_garrafones = req.body.cant_garrafones;
  let cuota_servicio = 5;
  let orden_status = "pending";
  let entrega_status = "pending";
  let fecha_pedido = new Date().toISOString();
  let fecha_entrega = "";

  const client = await Client.findById(id_client);

  if (client.horario.dias.length !== 0 && !isOnSchedule(client.horario)) {
    orden_status = "scheduled";
    entrega_status = "scheduled";
  }

  if (id_client == "" || cant_garrafones == "" || entrega_status == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else {
    // Try to create new order
    const newOrder = new Order({
      id_client,
      cant_garrafones,
      cuota_servicio,
      orden_status,
      entrega_status,
      fecha_pedido,
      fecha_entrega,
    });

    if (orden_status === "scheduled") {
      newOrder["fecha_programado"] = getNearestDate(client.horario);
    }

    newOrder
      .save()
      .then((result) => {
        if (result.orden_status === "scheduled") {
          const scheduledDate = scheduleOrder(
            result._id,
            getNearestDate(client.horario)
          );

          return res.json({
            status: "SUCCESS",
            message: `Pedido programado; se realizará automáticamente en esta fecha: ${scheduledDate}`,
            data: result,
            scheduledDate: scheduledDate.getTime(),
          });
        }

        res.json({
          status: "SUCCESS",
          message: "Orden creada exitosamente.",
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "Ocurrió un error al crear la orden.",
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
        message: "Se ha cambiado la status de la orden.",
        data: updatedP,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "No fue posible realizar el cambio de status.",
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
        message: "Se ha cambiado la status de la orden.",
        data: updatedP,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "No fue posible realizar el cambio de status.",
      });
    });
});

// aceptar solicitud de pedido
router.put("/:orderId/accept-request", async (req, res) => {
  const orderId = req.params.orderId;
  const carrierId = req.body.carrier;
  try {
    const order = await Order.findById(orderId);
    const carrier = await Carrier.findById(carrierId);
    const precioGarrafon = carrier.precioGarrafon;
    const cant_garrafones = order.cant_garrafones;
    const cuota_servicio = order.cuota_servicio;
    const precioTotal = precioGarrafon * cant_garrafones + cuota_servicio;

    await Order.findOneAndUpdate(
      { _id: orderId },
      {
        orden_status: "accepted",
        entrega_status: "accepted",
        id_carrier: ObjectId(carrierId),
        precio: precioGarrafon,
        total: precioTotal,
      }
    );
    res.json({
      status: "SUCCESS",
      message: "Se ha aceptado la solicitud de la orden.",
      data: await Order.findById(orderId),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "FAILED",
      message: "Ocurrió un error al aceptar la solicitud.",
    });
  }
});

// rechazar solicitud de pedido
router.put("/:orderId/decline-request", async (req, res) => {
  const orderId = req.params.orderId;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "declined",
      entrega_status: "pending",
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha rechazado la solicitud de la orden.",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "Ocurrió un error al rechazar la solicitud.",
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
        message: "Ha comenzado la entrega de la orden.",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "Ocurrió un error al comenzar la entrega.",
      });
    });
});

// cancelar orden
router.put("/:orderId/cancel-order", async (req, res) => {
  const orderId = req.params.orderId;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "canceled",
      entrega_status: "canceled",
      id_carrier: null,
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha cancelado la entrega de la orden.",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "Ocurrió un error al cancelar la entrega.",
      });
    });
});

// cancelar entrega
router.put("/:orderId/cancel-delivery", async (req, res) => {
  const orderId = req.params.orderId;
  Order.findOneAndUpdate(
    { _id: orderId },
    {
      orden_status: "pending",
      entrega_status: "pending",
      id_carrier: null,
      precio: null,
      total: null,
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha cancelado la entrega de la orden.",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "Ocurrió un error al cancelar la entrega.",
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
      fecha_entrega: new Date(),
    }
  )
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha finalizado la entrega de la orden.",
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "FAILED",
        message: "Ocurrió un error al cancelar la entrega.",
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
      message: "Orden obtenida exitosamente.",
      data: result,
    });
  });
});
// Consultar orden por id
router.get("/read/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findById(id);
    const client = await Client.findById(order.id_client);
    order.id_client = client;
    const carrier = await Carrier.findById(order.id_carrier);
    order.id_carrier = carrier;

    if (order) {
      res.json({
        status: "SUCCESS",
        message: "Orden obtenida exitosamente.",
        data: order,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "No fue posible obtener las órdenes pendientes.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "Ocurrió un error al obtener las órdenes pendientes.",
    });
  }
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
          message: "Orden obtenida exitosamente.",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message:
            "No fue posible encontrar órdenes vinculadas con el ID proporcionado.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Ocurrió un error al obtener las órdenes.",
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
          message: "Orden obtenida exitosamente.",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message:
            "No fue posible encontrar órdenes vinculadas con el ID proporcionado.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Ocurrió un error al obtener las órdenes.",
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
        message: "Orden obtenida exitosamente.",
        data: orders,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "No fue posible obtener las órdenes pendientes.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "Ocurrió un error al obtener las órdenes.",
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
        message: "Órdenes obtenidas exitosamente.",
        data: orders,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "No fue posible obtener las órdenes.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "Ocurrió un error al obtener las órdenes.",
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
        message: "Órdenes activas obtenidas exitosamente.",
        data: orders,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "No fue posible encontrar las órdenes activas.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "Ocurrió un error al obtener las órdenes.",
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
          message: "Órdenes en curso obtenidas exitosamente.",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message:
            "No fue posible encontrar órdenes activas vinculadas al ID proporcionado.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Ocurrió un error al obtener los pedidos en curso.",
      });
    });
});
//encontrar por colonia
router.get("/readbycolonia", async (req, res) => {
  const colony = req.query.colony;
  if (!colony) {
    return res.status(400).json({
      status: "FAILED",
      message: "El nombre de la colonia no es válido.",
    });
  }

  try {
    const clients = await Client.find({ "direccion.colonia": colony });
    const clientIds = clients.map((client) => client._id);

    const orders = await Order.find({ id_client: { $in: clientIds } });

    return res.json({
      status: "SUCCESS",
      message: `Órdenes de habitantes de la colonia ${colony} obtenidas exitosamente.`,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: "Ocurrió un error al obtener las órdenes.",
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
      message: "El día proporcionado no es válido.",
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
      message: "Ocurrió un error al obtener las órdenes.",
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
      message: "El día o la colonia no son válidos.",
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
      message: "Órdenes obtenidas exitosamente.",
      data: orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "FAILED",
      message: "Ocurrió un error al obtener las órdenes.",
      error: err,
    });
  }
});

// Obtener ordenes finalizadas - Carrier
router.get("/read/carrier/history/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const orders = await Order.find({
      id_carrier: id,
      orden_status: "accepted",
      entrega_status: "done",
    });

    for (let i = 0; i < orders.length; i++) {
      const client = await Client.findById(orders[i].id_client);
      orders[i].id_client = client;
      const carrier = await Carrier.findById(orders[i].id_carrier);
      orders[i].id_carrier = carrier;
    }

    orders.sort((a, b) => b.fecha_pedido - a.fecha_pedido); // Ordena de más reciente a más viejo

    if (orders.length !== 0) {
      res.json({
        status: "SUCCESS",
        message: "Órdenes obtenidas exitosamente.",
        data: orders,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "No fue posible encontrar órdenes finalizadas.",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "Ocurrió un error al obtener las órdenes.",
    });
  }
});

// Visualizar historial del cliente
router.get("/read/client/history/:id", async (req, res) => {
  const id = req.params.id;

  Order.find({
    id_client: id,
    orden_status: "accepted",
    entrega_status: "done",
  })
    .then(async (result) => {
      for (const order of result) {
        const client = await Client.findById(order.id_client);
        order.id_client = client;
        const carrier = await Carrier.findById(order.id_carrier);
        order.id_carrier = carrier;
      }

      console.log(result);
      result.sort((a, b) => b.fecha_pedido - a.fecha_pedido); // Ordena de más reciente a más viejo
      if (result.length !== 0) {
        res.json({
          status: "SUCCESS",
          message: "Historial obtenido exitosamente.",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "FAILED",
          message:
            "No fue posible encontrar el historial del ID de cliente proporcionado.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Ocurrió un error al obtener el historial del cliente.",
      });
    });
});

// reseña carrier a cliente
router.put("/:orderId/review/client", async (req, res) => {
  const orderId = req.params.orderId;
  const reseña = req.body.reseña;
  let calificacion = 0;
  let mensaje = "";
  await Order.findOne({
    _id: orderId,
    orden_status: "accepted",
    entrega_status: "done",
  })
    .then((cliente) => {
      Client.findById(cliente.id_client)
        .then((result) => {
          if (!cliente.reseñaCliente) {
            reseña.id_carrier = cliente.id_carrier;
            if (result["reseña"] !== undefined) {
              result.reseña.push(reseña);
            } else {
              result.reseña = [reseña];
            }
            result.reseña.forEach((calif) => {
              calificacion += Number(calif.calificacion);
            });
            result.calificacion = calificacion / result.reseña.length;
            result.calificacion = parseFloat(result.calificacion.toFixed(2));
            console.log(result.calificacion);
            Order.findOne({ _id: orderId }).then((r) => {
              console.log(r);
              r.reseñaCliente = true;
              r.save();
            });
            result.save();
            mensaje = "Reseña registrada exitosamente.";
          } else {
            mensaje = "Client already reviewed in this order";
          }
          res.json({
            status: "SUCCESS",
            message: mensaje,
          });
        })
        .catch((err) => {
          res.json({
            status: "FAILED",
            message: "Ocurrió un error al registrar la reseña.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Ocurrió un error al registrar la reseña.",
      });
    });
});
// reseña cliente a carrier
router.put("/:orderId/review/carrier", async (req, res) => {
  const orderId = req.params.orderId;
  const reseña = req.body.reseña;
  let calificacion = 0;
  let mensaje = "";
  await Order.findOne({
    _id: orderId,
    orden_status: "accepted",
    entrega_status: "done",
  })
    .then((carrier) => {
      Carrier.findById(carrier.id_carrier)
        .then((result) => {
          console.log(carrier.id_client);
          if (!carrier.reseñaCarrier) {
            reseña.id_client = carrier.id_client;
            if (result["reseña"] !== undefined) {
              result.reseña.push(reseña);
            } else {
              result.reseña = [reseña];
            }
            result.reseña.forEach((calif) => {
              calificacion += Number(calif.calificacion);
            });
            result.calificacion = calificacion / result.reseña.length;
            result.calificacion = parseFloat(result.calificacion.toFixed(2));
            console.log(result.calificacion);
            Order.findOne({ _id: orderId }).then((r) => {
              console.log(r);
              r.reseñaCarrier = true;
              r.save();
            });
            result.save();
            mensaje = "Reseña registrada exitosamente.";
          } else {
            mensaje = "Carrier already reviewed in this order";
          }
          res.json({
            status: "SUCCESS",
            messgae: mensaje,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            status: "FAILED",
            message: "Ocurrió un error al registrar la reseña.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "Ocurrió un error al registrar la reseña.",
      });
    });
});

module.exports = router;
