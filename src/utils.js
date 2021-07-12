const { google } = require("googleapis");
const jwt = require("jsonwebtoken");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  //   "https://www.googleapis.com/auth/blogger",
  //   "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/plus.me",
  "https://www.googleapis.com/auth/userinfo.email",
];

const googleSignInUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",

  // If you only need one scope you can pass it as a string
  scope: scopes,
});

const generateAccessToken = function (email) {
  return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
  });
};

// middleware
const authenticateToken = function (req, res, next) {
  console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
  const accessToken = req.cookies.jwt;

  // console.log(authHeader)

  // const token = authHeader && authHeader.split(" ")[1];

  if (accessToken == null) {
    return res.status(400).send("Unauthorized");
  }
  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //   console.log("err:", "err", "user:", user);
  //   if (err) return res.sendStatus(403);

  //   req.user = user;
  //   next();
  // });
  let payload
  try {
    //use the jwt.verify method to verify the access token
    //throws an error if the token has expired or has a invalid signature
    payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(payload)
    next();
  } catch (e) {
    // if an error occured return request unauthorized error
    console.log('SSSSSSSS',e)
    return res.status(500).send();
  }
};

module.exports = {
  oauth2Client,
  googleSignInUrl,
  generateAccessToken,
  authenticateToken,
};
