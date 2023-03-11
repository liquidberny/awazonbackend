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
    let calificacion = 1;
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
                        calificacion,
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
router.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const email = req.body.email;
    const num_contacto = req.body.num_contacto;
    if(id!==null || nombre!==null || apellidos!==null || email!==null || 
        num_contacto!==null || id!=="" || nombre!=="" || apellidos!=="" 
        || email!=="" || contrasena!=="" || num_contacto!==""){
            try {
                await Client.findById(id, (err, updatedClient) => {
                    updatedClient.nombre = nombre;
                    updatedClient.apellidos = apellidos;
                    updatedClient.email = email;
                    updatedClient.num_contacto = num_contacto;
                    updatedClient.save();
                    res.json({
                        status:"SUCCESS",
                        message:"Client successfully updated"
                    });
                });
            } catch (err) {
                console.log(err);
            }
    } else {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    }
});
//Cambiar contraseña
router.put("/updatePassword/:id"), async (req, res) => {
    const id = req.params.id;
    const contrasena = req.body.contrasena;
    const confirmContrasena = req.body.confirmContrasena;
    if(contrasena == confirmContrasena){
        try{
            await Client.findById(id, (err, updatedPassword) => {
                updatedPassword.contrasena = contrasena;
                updatedPassword.save();
                res.json({
                    status:"SUCCESS",
                    message:"Client successfully updated"
                });
            });
        } catch (err){
            console.log(err);
        }
    } else {
        res.json({
            status: "FAILED",
            message: "Passwords dont match!"
        });
    }
}

//Cambiar horario
router.put("/updateHorario/:id", async (req, res) => {
    const id = req.params.id;
    const dias = req.body.horario.dias;
    const hora_inicial = req.body.horario.hora_inicial;
    const hora_final = req.body.horario.hora_final;
    try {
        await Client.findById(id, (err, updatedHorario) => {
            updatedHorario.horario.dias = dias;
            updatedHorario.horario.hora_inicial = hora_inicial;
            updatedHorario.horario.hora_final = hora_final;
            updatedHorario.save();
            res.json({
                status:"SUCCESS",
                message:"Client's schedule successfully updated"
            });

        });
    } catch (err) {

        console.log(err);
    }
});

//Cambiar contraseña
router.put('/:userId/updatePassword', async (req, res) => {
    const userId = req.params.userId;
    const newPassword = req.body.password;
  
    const saltRounds = 10;
    const hashed = await bcrypt.hash(newPassword, saltRounds)
    Client.findOneAndUpdate(
      { _id: userId },
      { contrasena: hashed },
      { new: true }
    )
      .then(updatedUser => {
        res.json({
          status: "SUCCESS",
          message: "Client successfully updated",
          data: updatedUser
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'An error ocurred while changing password' });
      });
  });

//Cambiar direccion
router.put("/updateDireccion/:id", async (req, res) => {
    const id = req.params.id;
    const calle = req.body.direccion.calle;
    const numero = req.body.direccion.numero;
    const ciudad = req.body.direccion.ciudad;
    try {
        await Client.findById(id, (err, updatedDireccion) => {
            console.log(req.body);
            updatedDireccion.direccion.calle = calle;
            updatedDireccion.direccion.numero = numero;
            updatedDireccion.direccion.ciudad = ciudad;
            updatedDireccion.save();
            //res.send("updated");
            res.json({
                status:"SUCCESS",
                message:"Client's direction successfully updated"
            });
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
        //res.send(result);
        res.json({
            status:"SUCCESS",
            message:"Client successfully obtained",
            data:result
        });
        console.log(result);
    });
});

//get Client
router.get("/read", async (req, res) => {
    Client.find({}, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.json({
            status:"SUCCESS",
            message:"Client successfully obtained",
            data:result
        });
    });
});

module.exports = router;
