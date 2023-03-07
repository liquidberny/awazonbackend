const express = require("express");
const router = express.Router();
const User = require("../models/User");

//contrasena
const bcrypt = require('bcrypt');
//sign up
router.post('/signup', (req, res) => {
  let nombre = req.body.nombre;
  let apellidos = req.body.apellidos
  let email = req.body.email
  let contrasena = req.body.contrasena
  let num_contacto = req.body.num_contacto
  if (nombre == "" || email == "" || contrasena == "" || apellidos == "") {
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
    User.find({ email }).then(result => {
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
          const newUser = new User({
            nombre,
            apellidos,
            email,
            contrasena: hashedPassword,
            num_contacto
          });

          newUser.save().then(result => {
            res.json({
              status: "SUCCESS",
              message: "Sign up successful!",
              data: result
            })
          })
            .catch(err => {
              res.json({
                status: "FAILED",
                message: "An error occurred while saving user account!"
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

//Signin
router.post('/signin', (req, res) => {
  let { email, contrasena } = req.body;
  email = email.trim();
  contrasena = contrasena.trim();

  if (email == "" || contrasena == "") {
      res.json({
          status: "FAILED",
          message: "Empty credentials supplied"
      })
  } else {
      //Checks if the user exists
      User.find({ email })
          .then(data => {
              if (data.length) {
                  //User exists
                  const hashedPassword = data[0].contrasena;
                  bcrypt.compare(contrasena, hashedPassword).then(result => {
                      if (result) {
                          //Password match
                          res.json({
                              status: "SUCCESS",
                              message: "Signin successful",
                              data: data
                          })
                      } else {
                          res.json({
                              status: "FAILED",
                              message: "Invalid contrasena entered"
                          })
                      }
                  })
                      .catch(err => {
                          res.json({
                              status: "FAILED",
                              message: "An error occurred while comparing passwords"
                          });
                      });
              } else {
                  res.json({
                      status: "FAILED",
                      message: "Invalid credentials entered!"
                  })
              }
          })
          .catch(err => {
              res.json({
                  status: "FAILED",
                  message: "An error occured while checking for existing user"
              });
          })
  }
})
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
router.put("/updateUser", async (req, res) => {
  const id = req.body.id;
  const nombre = req.body.nombre;
  const apellidos = req.body.apellidos;
  const email = req.body.email;
  const contrasena = req.body.contrasena;
  const num_contacto = req.body.num_contacto;
  const calificacion = req.body.calificacion;
  try {
    await User.findById(id, (err, updatedUser) => {
      updatedUser.nombre = nombre;
      updatedUser.apellidos = apellidos;
      updatedUser.email = email;
      updatedUser.contrasena = contrasena;
      updatedUser.num_contacto = num_contacto;
      updatedUser.calificacion = calificacion;
      updatedUser.save();
      res.send("updated");
    });
  } catch (err) {
    console.log(err);
  }
});

//delete user
router.put("/deleteUser/:id",async (req, res)=>{
  let id = req.params.id;
  User
  .findByIdAndRemove(id)
  .exec()
  .then(doc =>{
    if(!doc){return res.status(404).end();}
    return res.status(204).end();
  })
  .catch(err => next(err));
});


module.exports = router;
