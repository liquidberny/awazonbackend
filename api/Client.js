const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

//contrasena
const bcrypt = require('bcrypt');
//signup client
router.post('/signupClient', (req, res) => {
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos
    let email = req.body.email
    let contrasena = req.body.contrasena
    let num_contacto = req.body.num_contacto
    let calificacion = req.body.calificacion
    let calle=req.body.calle;
    let numero=req.body.numero;
    let ciudad=req.body.ciudad;
    let balance = req.body.balance;
    let dias = req.body.dias;
    let hora_inicial = req.body.hora_inicial;
    let hora_final = req.body.hora_final;
    if (nombre == "" || email == "" || contrasena == "" || apellidos == "" ||
    calle=="" || numero=="" || ciudad=="" || balance=="" || dias=="" ||
    hora_inicial=="" || hora_final=="" || calificacion=="") {
      res.json({
        status: "FAILED",
        message: "Empty input fields!"
      });
    } else if (!/[^0-9\.\,\"\?\!\;\:\#\$\%\&\(\)\*\+\-\/\<\>\=\@\[\]\\\^\_\{\}\|\~]*$/.test(nombre)) {
      res.json({
        status: "FAILED",
        message: "Invalid nombre entry"
      })
    } else if (!/^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/.test(email)) {
      res.json({
        status: "FAILED",
        message: "Invalid email entered"
      })
    } else {
      //Checking if user already exists
      Client.find({ email }).then(result => {
        if (result.length) {
          // A user already exists
          res.json({
            status: "FAILED",
            message: "User with the provided email already exists"
          })
        } else {
          // Try to create new user
  
          //Password handling
          const saltRounds = 10;
          bcrypt.hash(contrasena, saltRounds).then(hashedPassword => {
            const newUser = new Client({
              nombre,
              apellidos,
              email,
              contrasena: hashedPassword,
              num_contacto,
              calificacion,
              direccion:{
                calle,
                numero,
                ciudad
              },
              balance,
              horario:{
                dias,
                hora_inicial,
                hora_final
              }
            });
  
            newUser.save().then(result => {
              res.json({
                status: "SUCCESS",
                message: "Sign up (client) successful!",
                data: result
              })
            })
              .catch(err => {
                res.json({
                  status: "FAILED",
                  message: "An error occurred while saving user (client) account!"
                })
              })
          })
            .catch(err => {
              res.json({
                status: "FAILED",
                message: "An error occurred while hashing contrasena!"
              })
            })
        }
  
      }).catch(err => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error ocurred while checking for existing user!"
        });
      });
    }
  });

//Cambiar horario
router.put("/updateHorario/:id", async (req, res) => {
    const id = req.body.id;
    const dias = req.body.horario.dias;
    const hora_inicial = req.body.horario.hora_inicial;
    const hora_final = req.body.horario.hora_final;
    try {
        await Client.findById(id, (err, updatedHorario) => {
        updatedHorario.dias = dias;
        updatedHorario.hora_inicial = hora_inicial;
        updatedHorario.hora_final = hora_final;
        updatedHorario.save();
        res.send("updated");

        });
    } catch (err) {

        console.log(err);
    }
    });

module.exports = router;