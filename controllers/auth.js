const jwt = require("jsonwebtoken");

// Never do this!
let users = {
  john: { password: "passwordjohn" },
  mary: { password: "passwordmary" },
};

const login = function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  // Neither do this!
  try {
    console.log(
      !username || !password || users[username].password !== password
    );
    if (!username || !password || users[username].password !== password) {
      console.log("check");
      return res.status(401).send();
    }
  } catch (e) {
    console.log("Here");
    return res.status(400).send(e);
  }

  //use the payload to store information about the user such as username, user role, etc.
  let payload = { username: username };

  //create the access token with the shorter lifespan

  console.log(process.env.ACCESS_TOKEN_LIFE);
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

  //create the refresh token with the longer lifespan
  let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });

  //store the refresh token in the user array
  users[username].refreshToken = refreshToken;

  console.log(users);

  //send the access token to the client inside a cookie
  res.cookie("jwt", accessToken, { secure: true, httpOnly: true });
  res.send();
};

const refresh = (req, res) => {

    const accessToken = req.cookies.jwt;
    if(!accessToken){
        return res.send("no access token")
    }

    let payload;
    try{
        payload=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET,{ignoreExpiration: true})
    }
    catch(e){
         res.send(`${e} ${payload} `)
    }
    
    console.log(payload,'but invalid')
    // retrive refress token form users array
    refreshToken = users[payload.username].refreshToken

    try{
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    }
    catch(e){
        return res.send(`{e} refress token is invalid`)
    }

    const newToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{
        algorithm:"HS256",
        expiresIn:process.env.ACCESS_TOKEN_LIFE,
    })

    res.cookies('jwt',newToken,{httpOnly:true,secure:true})







  
};

const dashboard = (req, res) => {
  res.send("Dashboard");
};

module.exports = { login, refresh, dashboard };
