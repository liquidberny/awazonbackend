//Import env
require("dotenv").config();
//mongodb
require("./config/db");

const app = require("express")();

//cors
const cors = require("cors");
app.use(cors());
//For accepting post from data
const bodyParser = require("express").json;
app.use(
  bodyParser({
    limits: { fileSize: 3 * 1024 * 1024 },
  })
);

// const UserRouter = require("./api/User");
const ClientRouter = require("./api/Client");
const CarrierRouter = require("./api/Carrier");
const OrderRouter = require("./api/Order");
// app.use("/user", UserRouter);
app.use("/client", ClientRouter);
app.use("/carrier", CarrierRouter);
app.use("/order", OrderRouter);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
