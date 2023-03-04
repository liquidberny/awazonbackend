const express = require("express");
const router = express.Router();
const User = require("./../models/User");

//Read User
router.get("/read/:id", async (req, res) => {
  let id = req.params.id;
  await User.findById(id).exec((err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
    console.log(result);
  });
});

//get User
router.get("/read", async (req, res) => {
  User.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

//edit user
router.put("/updateUser",async (req,res)=>{
  const id=req.body.id;
  const name = req.body.name;
  const apellidos = req.body.apellidos;
  const email = req.body.email;
  const password = req.body.password;
  const num_contacto = req.body.num_contacto;
  const calificacion = req.body.calificacion;
  try {
    await User.findById(id,(err,updatedUser)=>{
      updatedUser.name=name;
      updatedUser.apellidos=apellidos;
      updatedUser.email=email;
      updatedUser.password=password;
      updatedUser.num_contacto=num_contacto;
      updatedUser.calificacion=calificacion;
      updatedUser.save();
      res.send("updated");
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
