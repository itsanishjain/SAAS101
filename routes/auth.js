const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

function authCheck(req,res,next){
  console.log("hey");
}

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  const user = await User.findOne({ email });
  if (!user) {
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = User({ email: email, password: hashPassword });
    await newUser.save();
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
    res.cookie("JWT", accessToken, { secure: true, httpOnly: true });
    return res.redirect("/dashboard");
  }
  console.log(user)
  return res.redirect("/auth/login");
});

// login
router.get("/login", (req, res) => {
  const accessToken = req.cookies.JWT;
  console.log(accessToken,'Woo');
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(payload);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error,"Here I am ");

  }
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)
  const user = await User.findOne({ email });
  console.log("login", user);
  if (user) {
    if (bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
      res.cookie("JWT", accessToken, { secure: true, httpOnly: true });
      return res.redirect("/dashboard");
    } else {
      console.log("Password error");
      return res.redirect("/login");
    }
  }
  return res.redirect("/");
});

module.exports = router;
