const router = require("express").Router();
const { google } = require("googleapis");
const axios = require("axios");

//get google signIn
router.get("/google", (req, res) => {
//   const googleSignedIn = req.cookies.googleSignedIn;
//   console.log(googleSignedIn);
//   if (googleSignedIn) {
//     return res.redirect("/user/dashboard");
//   }
//   console.log("Here Here");
//   res.cookie("googleSignedIn", true);
  res.render("googlePage");
});
//post google signIn
// router.post("/google", (req, res) => {
//   res.send("sigiup successfully");
// });




// Import the axios library, to make HTTP requests

// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = "18b39c8ed9ee6f62c1fc";
const clientSecret = "5da22d9f61d73a49f8f948130965677df8da4378";

// Declare the callback route
router.get("/google", (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code;

  console.log(requestToken,"FSDFDSFDSFDSF")

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    access_token = response.data.access_token;
    res.redirect("/success");
  });
});

router.get("/success", function (req, res) {
    console.log("I am on success Route")
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  }).then((response) => {
    console.log(response.data)
    res.render("dashboard", { userData: response.data });
  });
});

module.exports = router;
