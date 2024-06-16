require("../src/models/userModel");
require("../src/models/constructorModel");
require("../src/models/proposalModel");
require("../src/models/appointmentModel");
const express = require("express");
const bodyParser = require("body-parser");
const requireAtuh = require("../src/middlewares/requireAuth");
const authRoutes = require("../src/routes/authRoute");
const proposalRoutes = require("../src/routes/proposalRoute");
const appointmentRoute = require("../src/routes/appointmentRoute");
const paymentRoute = require("../src/routes/paymentRoute");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
// const fileUpload = require("express-fileupload");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());
app.use(authRoutes);
app.use(proposalRoutes);
app.use(appointmentRoute);
app.use(paymentRoute);
//connection
dotenv.config({ path: "src/config/config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.DB_URI);
mongoose.connection.on("connected", () => {
  console.log("connected to mongoose instance");
});

mongoose.connection.on("error", (err) => {
  console.error("error connecting to mongo", err);
});

app.get("/", requireAtuh, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Sever is working on http://localhost:${process.env.PORT}`);
});
