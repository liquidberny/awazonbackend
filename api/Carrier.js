const express = require("express");
const router = express.Router();
const Carrier = require("../models/Carrier");

//contrasena
const bcrypt = require('bcrypt');
// signup carrier
router.post('/signupCarrier', (req, res) => {
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos;
    let email = req.body.email;
    let contrasena = req.body.contrasena;
    let num_contacto = req.body.num_contacto;
    let matricula = req.body.matricula;
    let marca = req.body.marca;
    let modelo = req.body.modelo;
    let año = req.body.año;



    if (nombre == "" || email == "" || contrasena == "" || apellidos == "" ||
        matricula == "" || marca == "" || modelo == "" || año == "") {
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
        Carrier.find({ email }).then(result => {
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

                    const newCarrier = new Carrier({
                        nombre,
                        apellidos,
                        email,
                        contrasena: hashedPassword,
                        num_contacto,
                        email,
                        vehiculo: {
                            matricula,
                            marca,
                            modelo,
                            año
                        },
                    });

                    newCarrier.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Sign up (Carrier) successful!",
                            data: result
                        })
                    })
                        .catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while saving carrier account!"
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

module.exports = router;
