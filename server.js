//mongodb
require("./config/db");

const app = require("express")();
const port = 3001;

//cors
const cors = require("cors");
app.use(cors());
//For accepting post from data
const bodyParser = require('express').json;
app.use(bodyParser({
  limits: { fileSize: 3 * 1024 * 1024 }
}));
const UserRouter = require("./api/User");

app.use("/user", UserRouter);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
