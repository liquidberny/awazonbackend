const express = require("express");
const router = express.Router();
const Carrier = require("../models/Carrier");
const Order = require("../models/Order");
const Client = require("../models/Client");

//contrasena
const bcrypt = require("bcrypt");
// signup carrier
router.post("/signup", (req, res) => {
  let nombre = req.body.nombre;
  let apellidos = req.body.apellidos;
  let email = req.body.email;
  let contrasena = req.body.contrasena;
  let num_contacto = req.body.num_contacto;
  let calificacion = 5;
  let matricula = req.body.matricula;
  let marca = req.body.marca;
  let modelo = req.body.modelo;
  let color = req.body.color;
  let precioGarrafon = req.body.precioGarrafon;

  if (
    nombre == "" ||
    email == "" ||
    contrasena == "" ||
    apellidos == "" ||
    matricula == "" ||
    marca == "" ||
    modelo == "" ||
    color == "" ||
    precioGarrafon == ""
  ) {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (
    !/[^0-9\.\,\"\?\!\;\:\#\$\%\&\(\)\*\+\-\/\<\>\=\@\[\]\\\^\_\{\}\|\~]*$/.test(
      nombre
    )
  ) {
    res.json({
      status: "FAILED",
      message: "Invalid nombre entry",
    });
  } else if (
    !/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(
      email
    )
  ) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else {
    //Checking if user already exists
    Carrier.find({ email })
      .then((result) => {
        if (result.length) {
          // A user already exists
          res.json({
            status: "FAILED",
            message: "User with the provided email already exists",
          });
        } else {
          // Try to create new user

          //Password handling
          const saltRounds = 10;
          bcrypt
            .hash(contrasena, saltRounds)
            .then((hashedPassword) => {
              const newCarrier = new Carrier({
                nombre,
                apellidos,
                email,
                contrasena: hashedPassword,
                num_contacto,
                calificacion,
                vehiculo: {
                  matricula,
                  marca,
                  modelo,
                  color,
                },
                precioGarrafon,
              });

              newCarrier
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "Sign Up Succesful",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "An error occurred while saving carrier account!",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing contrasena!",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error ocurred while checking for existing user!",
        });
      });
  }
});

//Signin
router.post("/signin", (req, res) => {
  let { email, contrasena } = req.body;
  email = email.trim();
  contrasena = contrasena.trim();

  if (email == "" || contrasena == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  } else {
    //Checks if the carrier exists
    Carrier.find({ email })
      .then((data) => {
        if (data.length) {
          //Carrier exists
          const hashedPassword = data[0].contrasena;
          bcrypt
            .compare(contrasena, hashedPassword)
            .then((result) => {
              if (result) {
                //Password match
                res.json({
                  status: "SUCCESS",
                  message: "Signin successful",
                  data: data,
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Invalid contrasena entered",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occurred while comparing passwords",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials entered!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occured while checking for existing user",
        });
      });
  }
});
//Read Carrier
router.get("/read/:id", async (req, res) => {
  let id = req.params.id;
  await Carrier.findById(id).exec((err, result) => {
    try {
      if (err) {
        return res.send(err);
      }
      result.calificacion = parseFloat(result.calificacion.toFixed(2));
      res.json({
        status: "SUCCESS",
        message: "Carrier succesfully found",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: "Ocurrió un error al obtener los datos del repartidor.",
      });
    }
  });
});

//get Carrier
router.get("/read", async (req, res) => {
  Carrier.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    //res.send(result);
    res.send({
      status: "SUCCESS",
      message: "Carrier successfully obtained",
      data: result,
    });
  });
});
//edit carrier
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const nombre = req.body.nombre;
  const apellidos = req.body.apellidos;
  const email = req.body.email;
  const num_contacto = req.body.num_contacto;
  if (
    id !== null ||
    nombre !== null ||
    apellidos !== null ||
    email !== null ||
    num_contacto !== null ||
    id !== "" ||
    nombre !== "" ||
    apellidos !== "" ||
    email !== "" ||
    contrasena !== "" ||
    num_contacto !== ""
  ) {
    Carrier.find({ email }).then(async (result) => {
      try {
        await Carrier.findById(id, (err, updatedCarrier) => {
          var same_email = false;
          if (updatedCarrier.email === email) {
            same_email = true;
          }
          if (result.length != 0 && same_email === false) {
            res.json({
              status: "FAILED",
              message: "User with the provided email already exists",
            });
          } else {
            updatedCarrier.nombre = nombre;
            updatedCarrier.apellidos = apellidos;
            updatedCarrier.email = email;
            updatedCarrier.num_contacto = num_contacto;
            updatedCarrier.save();
            res.json({
              status: "SUCCESS",
              message: "Carrier successfully updated",
              data: updatedCarrier,
            });
          }
          var same_email = false;
        });
      } catch (err) {
        console.log(err);
      }
    });
  } else {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  }
});

//Cambiar contraseña
router.put("/:userId/updatePassword", async (req, res) => {
  const userId = req.params.userId;
  const newPassword = req.body.password;

  const saltRounds = 10;
  const hashed = await bcrypt.hash(newPassword, saltRounds);
  Carrier.findOneAndUpdate(
    { _id: userId },
    { contrasena: hashed },
    { new: true }
  )
    .then((updatedUser) => {
      res.json({
        status: "SUCCESS",
        message: "Carrier successfully updated",
        data: updatedUser,
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error ocurred while changing password" });
    });
});

//edit  Vehiculo
router.put("/updateVehiculo/:id", async (req, res) => {
  const id = req.params.id;
  const matricula = req.body.vehiculo.matricula;
  const marca = req.body.vehiculo.marca;
  const modelo = req.body.vehiculo.modelo;
  const color = req.body.vehiculo.color;
  try {
    await Carrier.findById(id, (err, updatedVehiculo) => {
      updatedVehiculo.vehiculo.matricula = matricula;
      updatedVehiculo.vehiculo.marca = marca;
      updatedVehiculo.vehiculo.modelo = modelo;
      updatedVehiculo.vehiculo.color = color;

      updatedVehiculo.save();
      res.json({
        status: "SUCCESS",
        message: "Carrier's vehicle successfully updated",
      });
    });
  } catch (err) {
    console.log(err);
  }
});
// update carrier status
router.put("/updateStatus/:id", async (req, res) => {
  const id = req.params.id;
  const isActive = req.body.isActive;
  if (isActive === true || isActive === false) {
    try {
      await Carrier.findById(id, (err, updatedCarrier) => {
        updatedCarrier.isActive = isActive;
        updatedCarrier.save();
        res.json({
          status: "SUCCESS",
          message: "Carrier's status successfully updated",
        });
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.json({
      status: "FAILED",
      message: "Invalid data type",
    });
  }
});

//get Active Carriers
router.get("/readActive", async (req, res) => {
  Carrier.find({ isActive: true }, (err, result) => {
    if (err) {
      res.send(err);
    }
    //res.send(result);
    res.json({
      status: "SUCCESS",
      message: "Active carriers successfully obtained",
      data: result,
    });
  });
});

//Cambiar precio garrafon
router.put("/:userId/updatePrecioGarrafon", async (req, res) => {
  const userId = req.params.userId;
  const precioGarrafon = req.body.precioGarrafon;

  Carrier.findOneAndUpdate({ _id: userId }, { precioGarrafon: precioGarrafon })
    .then((updatedP) => {
      res.json({
        status: "SUCCESS",
        message: "Se ha podido cambiar el precio del garrafon",
        data: updatedP,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        status: "ERROR",
        message: "No se pudo cambiar el precio del garrafon.",
      });
    });
});

//review
router.put("/review/:id", (req, res) => {
  const id = req.params.id;
  const calificacion = req.body.calificacion;

  try {
    Carrier.findById(id, (err, updatedReview) => {
      updatedReview.calificacion =
        (calificacion + updatedReview.calificacion) / 2;
      updatedReview.save();
      res.json({
        status: "SUCCESS",
        message: "Se ha podido actualizar la review del carrier",
      });
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/balance/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const carrier = await Carrier.findById(id);
    let total = 0;
    let serviceFee = 0;
    let balance = 0;
    const orders = await Order.find({
      id_carrier: id,
      orden_status: "accepted",
      entrega_status: "done",
    });

    for (let i = 0; i < orders.length; i++) {
      const client = await Client.findById(orders[i].id_client);
      orders[i].id_client = client;
      total += orders[i].total;
      serviceFee += orders[i].cuota_servicio;
      balance += orders[i].cant_garrafones * orders[i].precio;
    }

    carrier.balance.total = total;
    carrier.balance.servicio = serviceFee;
    carrier.balance.ganancias = balance;

    if (carrier) {
      res.json({
        status: "SUCCESS",
        message: "Orders successfully obtained",
        data: carrier,
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "Unable to find carrier",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "An error ocurred while checking for existing carrier!",
    });
  }
});

router.get("/home/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let weeklyBalance = 0;
    let weeklyOrders = 0;
    let todayOrders = 0;

    let orders = await Order.find({
      fecha_pedido: {
        $gte: Date.now() - 7 * 60 * 60 * 24 * 1000,
      },
      id_carrier: id,
      entrega_status: "done",
    });
    weeklyOrders = orders.length;
    for (let i = 0; i < orders.length; i++) {
      weeklyBalance += orders[i].cant_garrafones * orders[i].precio;
    }

    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);

    orders = await Order.find({
      fecha_pedido: { $gte: start, $lt: end },
      id_carrier: id,
      entrega_status: "done",
    });

    todayOrders = orders.length;

    if (id) {
      res.json({
        status: "SUCCESS",
        message: "Data successfully obtained",
        data: {
          weeklyBalance: weeklyBalance,
          weeklyOrders: weeklyOrders,
          todayOrders: orders.length,
        },
      });
    } else {
      res.status(200).json({
        status: "FAILED",
        message: "Unable to find carrier",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "An error ocurred while checking for existing carrier!",
    });
  }
});

module.exports = router;
