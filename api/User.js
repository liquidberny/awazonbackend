const express = require("express");
const router = express.Router();
const User = require("../models/User");

//password
const bcrypt = require('bcrypt');
//sign up
router.post('/signup', (req, res) => {
  let name = req.body.name;
  let apellidos = req.body.apellidos
  let email = req.body.email
  let password = req.body.password
  let num_contacto = req.body.num_contacto
  if (name == "" || email == "" || password == "" || apellidos == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!"
    });
  } else if (!/[^0-9\.\,\"\?\!\;\:\#\$\%\&\(\)\*\+\-\/\<\>\=\@\[\]\\\^\_\{\}\|\~]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entry"
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
        bcrypt.hash(password, saltRounds).then(hashedPassword => {
          const newUser = new User({
            name,
            apellidos,
            email,
            password: hashedPassword,
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
              message: "An error occurred while hashing password!"
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
  const name = req.body.name;
  const apellidos = req.body.apellidos;
  const email = req.body.email;
  const password = req.body.password;
  const num_contacto = req.body.num_contacto;
  const calificacion = req.body.calificacion;
  try {
    await User.findById(id, (err, updatedUser) => {
      updatedUser.name = name;
      updatedUser.apellidos = apellidos;
      updatedUser.email = email;
      updatedUser.password = password;
      updatedUser.num_contacto = num_contacto;
      updatedUser.calificacion = calificacion;
      updatedUser.save();
      res.send("updated");
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
