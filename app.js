const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
require("dotenv").config();

//TODO:sql-injections so we need to use joi or celebarate - https://github.com/arb/celebrate,https://docs.sqreen.com/nodejs/installation/

const UserService = require("./src/user");
const userService = require("./src/user/user.service");

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((error) => console.log(error.message));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { title: "SAAS101" });
});

app.get("/home", (req, res) => {
  res.render("home", { title: "Home" });
});

app.post("/signup", async (req, res) => {
  let user = await UserService.getUserByEmail(req.body.email);
  if (user) {
    return res.send("User already exits");
  }

  user = await UserService.addUser({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  res.send("Success");
});

app.post("/login", async (req, res) => {
  const { email } = req.body;
  console.log("email", email);
  let user = await UserService.getUserByEmail(email);
  if(!user){
      return res.send("Please check your email or password")
  }
  res.send(user);
});

const PORT = 8003;
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
