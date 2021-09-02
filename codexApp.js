//create express variable and setup ejs template engine
var express = require("express");
var bodyParser = require("body-parser");
var bcryptjs = require("bcryptjs");
var app = express();

app.set("view engine", "ejs");

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// import passportjs for google signup
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

//create mongoose variable and use this uri as mongodb+srv://admin:<password>@cluster0.cydnc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//to connect to database

var mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.cydnc.mongodb.net/CODEX?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((mess) => console.log("CONECTED"))
  .catch((err) => console.log("DB error", err));

//create mongoose schema
var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  firstName: String,
  lastName: String,
});

//create mongoose model
var User = mongoose.model("User", userSchema);

//routes
// create get route for home page
app.get("/", function (req, res) {
  res.render("home");
});

//create get route for about page
app.get("/about", function (req, res) {
  res.render("about");
});

//create a route for register page
app.get("/register", function (req, res) {
  res.render("register");
});

//create a route for register page
app.get("/login", function (req, res) {
  res.render("login");
});

//post route for register page
app.post("/register", function (req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcryptjs.hashSync(req.body.password, 10),
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("User saved successfully");
      res.status(200).send("User saved successfully");
    }
  });
});

//post route for login page
app.post("/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //check if username exists
  User.findOne({ username: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        //compare passwords
        bcryptjs.compare(password, foundUser.password, function (err, result) {
          if (result) {
            //passwords match
            // res.render("secrets");
            res.send("Secrets");
          } else {
            //passwords do not match
            res.send("Incorrect Password");
          }
        });
      } else {
        res.send("User not found");
      }
    }
  });
});

// passportjs for google signup

//serialize user
passport.serializeUser(function (user, done) {
  console.log("SERIAL");
  done(null, user.id);
});

//deserialize user
passport.deserializeUser(function (id, done) {
  console.log("DE-SERIAL");
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//create google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "369662659886-b48hh31n5na6fih590g6tgoo89uqvcsc.apps.googleusercontent.com",
      clientSecret: "_0l0dm55FDNE6fVB2Xnf_OAo",
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      cb(null, profile);
    }
  )
);

//now use the google strategy to create sigup route

//create get route for google signup
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

//create get route for google callback
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    console.log("HERE", req.params);
    // res.redirect("/secrets");
    res.send("secrets");
  }
);

// listen the app in port 3000 to serve our website
app.listen(3000, function () {
  console.log("Server started on port 3000");
});

//import googlecalerndar apis module
//import googlecalendar apis module
const { google } = require("googleapis");
//create google calendar api variable
const calendar = google.calendar("v3");


console.log(calendar)