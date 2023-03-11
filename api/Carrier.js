const express = require("express");
const router = express.Router();
const Carrier = require("../models/Carrier");

//contrasena
const bcrypt = require("bcrypt");
// signup carrier
router.post("/signup", (req, res) => {
  let nombre = req.body.nombre;
  let apellidos = req.body.apellidos;
  let email = req.body.email;
  let contrasena = req.body.contrasena;
  let num_contacto = req.body.num_contacto;
  let calificacion = req.body.calificacion;
  let matricula = req.body.matricula;
  let id_transp = req.body.id_transp;
  let marca = req.body.marca;
  let modelo = req.body.modelo;
  let año = req.body.año;
  let precioGarrafon = req.body.precioGarrafon;
  let balance = req.body.balance;

  if (
    nombre == "" ||
    email == "" ||
    contrasena == "" ||
    apellidos == "" ||
    matricula == "" ||
    id_transp == "" ||
    marca == "" ||
    modelo == "" ||
    año == "" ||
    precioGarrafon == "" ||
    balance == "" ||
    calificacion == ""
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
                email,
                calificacion,
                vehiculo: {
                  matricula,
                  id_transp,
                  marca,
                  modelo,
                  año,
                },
                precioGarrafon,
                balance,
              });

              newCarrier
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "Sign up (Carrier) successful!",
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

//Read Carrier
router.get("/read/:id", async (req, res) => {
  let id = req.params.id;
  await Carrier.findById(id).exec((err, result) => {
    if (err) {
      res.send(err);
    }
    res.json({
      status: "SUCCESS",
      message: "Carrier succesfully found",
      data: result
    });
  });
});

//get Carrier
router.get("/read", async (req, res) => {
  Carrier.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});
//edit carrier
router.put("/update", async (req, res) => {
  const id = req.body.id;
  const nombre = req.body.nombre;
  const apellidos = req.body.apellidos;
  const email = req.body.email;
  const contrasena = req.body.contrasena;
  const num_contacto = req.body.num_contacto;
  try {
    await Carrier.findById(id, (err, updatedCarrier) => {
      updatedCarrier.nombre = nombre;
      updatedCarrier.apellidos = apellidos;
      updatedCarrier.email = email;
      updatedCarrier.contrasena = contrasena;
      updatedCarrier.num_contacto = num_contacto;
      updatedCarrier.save();
      res.send("updated");
    });
  } catch (err) {
    console.log(err);
  }
});

//edit  Vehiculo
router.put("/updateVehiculo/:id", async (req, res) => {
  const id = req.params.id;
  const matricula = req.body.vehiculo.matricula;
  const id_transp = req.body.vehiculo.id_transp;
  const marca = req.body.vehiculo.marca;
  const modelo = req.body.vehiculo.modelo;
  const año = req.body.vehiculo.año;
  try {
    await Carrier.findById(id, (err, updatedVehiculo) => {
      updatedVehiculo.matricula = matricula;
      updatedVehiculo.id_transp = id_transp;
      updatedVehiculo.marca = marca;
      updatedVehiculo.modelo = modelo;
      updatedVehiculo.año = año;

      updatedVehiculo.save();
      res.send("updated");
    });
  } catch (err) {
    console.log(err);
  }
});
 // update carrier status
router.put("/updateStatus/:id", async (req, res) => {
  const id = req.params.id;
  const isActive = req.body.isActive;
  if(isActive===true || isActive===false){
    try {
      await Carrier.findById(id, (err, updatedCarrier) => {
        updatedCarrier.isActive = isActive;
        updatedCarrier.save();
        res.send("updated");
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.send("isActive is not a bool");
  }
});

//get Active Carriers
router.get("/readActive", async (req, res) => {
  Carrier.find({isActive: true}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

module.exports = router;
