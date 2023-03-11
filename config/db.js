require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose
    .connect("mongodb+srv://awasonochoa:Pxf0LmTa7SJr38wJ@awasoncluster.zee8ncw.mongodb.net/awasonochoa?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB Connected');
    })
    .catch((err) => console.log(err));
