const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

//contrasena
const bcrypt = require('bcrypt');
//signup client
router.post('/signup', (req, res) => {
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos
    let email = req.body.email
    let contrasena = req.body.contrasena
    let num_contacto = req.body.num_contacto
    let calle = req.body.calle;
    let numero = req.body.numero;
    let ciudad = req.body.ciudad;
    let dias = req.body.dias;
    let hora_inicial = req.body.hora_inicial;
    let hora_final = req.body.hora_final;

    if (nombre == "" || email == "" || contrasena == "" || apellidos == "" ||
        calle == "" || numero == "" || ciudad == "" || dias == "" ||
        hora_inicial == "" || hora_final == "") {
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
                        direccion: {
                            calle,
                            numero,
                            ciudad
                        },
                        horario: {
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

//edit client
router.put("/update", async (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const email = req.body.email;
    const contrasena = req.body.contrasena;
    const num_contacto = req.body.num_contacto;
    try {
        await Client.findById(id, (err, updatedClient) => {
            updatedClient.nombre = nombre;
            updatedClient.apellidos = apellidos;
            updatedClient.email = email;
            updatedClient.contrasena = contrasena;
            updatedClient.num_contacto = num_contacto;
            updatedClient.save();
            res.send("updated");
        });
    } catch (err) {
        console.log(err);
    }
});

//Cambiar horario
router.put("/updateHorario/:id", async (req, res) => {
    const id = req.params.id;
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

//Cambiar direccion
router.put("/updateDireccion/:id", async (req, res) => {
    const id = req.params.id;
    const calle = req.body.horario.calle;
    const numero = req.body.horario.numero;
    const ciudad = req.body.horario.ciudad;
    try {
        await Client.findById(id, (err, updatedDireccion) => {
            updatedDireccion.calle = calle;
            updatedDireccion.numero = numero;
            updatedDireccion.ciudad = ciudad;
            updatedDireccion.save();
            res.send("updated");

        });
    } catch (err) {

        console.log(err);
    }
});

//Read Client
router.get("/read/:id", async (req, res) => {
    let id = req.params.id;
    await Client.findById(id).exec((err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
        console.log(result);
    });
});

//get Client
router.get("/read", async (req, res) => {
    Client.find({}, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

module.exports = router;
