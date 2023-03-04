//mongodb
require("./config/db");

const app = require("express")();
const port = 3001;

//cors
const cors = require("cors");
app.use(cors());

const UserRouter = requiere("./api/User");

app.use("/user", UserRouter);
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
