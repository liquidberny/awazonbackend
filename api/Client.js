const express = require("express");
const router = express.Router();
const Client = require("../models/Client");

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
