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

module.exports = router;
