const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const OpenAI = require("openai-api");
const cookieParser = require("cookie-parser");
const { encode } = require("gpt-3-encoder");
const jwt = require("jsonwebtoken");

const app = express();
require("dotenv").config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);
const User = require("./models/User");

// establish connection to database
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((error) => console.log(error.message));

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// setting template engine
app.set("view engine", "ejs");

//signup
app.get("/", (req, res) => {
  res.render("pages/register");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = User({ email: email, password: hashPassword });
    await newUser.save();
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
    res.cookie("JWT", accessToken, { secure: true, httpOnly: true });
    return res.redirect("/dashboard");
  }
  return res.redirect("/login");
});

// login
app.get("/login", (req, res) => {
  const accessToken = req.cookies.JWT;
  console.log(accessToken);
  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(payload);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
  res.render("pages/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("login", user);
  if (user) {
    if (bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
      res.cookie("JWT", accessToken, { secure: true, httpOnly: true });
      return res.redirect("/dashboard");
    } else {
      console.log("Password error")
      return res.redirect("/login");
    }
  }
  return res.redirect("/");
});

//dashboard
app.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});

//########################## GPT3 ####################################3

//GPT3-API

// Content Filter Helper Function
async function contentFilter(responseText) {
  try {
    const response = await openai.complete({
      engine: "content-filter-alpha-c4",
      prompt: `<|endoftext|>${responseText}\n--\nLabel:`,
      maxTokens: 1,
      temperature: 0,
      topP: 0,
      logprobs: 10,
    });
    // console.log("content filter", response.data);
    var output_label = response.data["choices"][0]["text"];
    toxic_threshold = -0.355;
    if (output_label == "2") {
      logprobs = response.data["choices"][0]["logprobs"]["top_logprobs"][0];
      if (logprobs["2"] < toxic_threshold) {
        logprob_0 = logprobs.hasOwnProperty("0") ? logprobs["0"] : null;
        logprob_1 = logprobs.hasOwnProperty("1") ? logprobs["1"] : null;
        if (logprob_0 != null && logprob_1 != null) {
          if (logprob_0 >= logprob_1) output_label = "0";
          else output_label = "1";
        } else if (logprob_0 != null) output_label = "0";
        else if (logprob_1 != null) output_label = "1";
      }
    }
    if (!["0", "1", "2"].includes(output_label)) output_label = "2";
    return output_label;
  } catch (error) {
    console.log("error in content filter", error);
    return "2";
  }
}

function tokensCount(text) {
  const count = encode(text).length;
  console.log("HERE", count);
  return count;
}

// Ideas-API
app.get("/ideas", (req, res) => {
  res.render("ideas");
});

app.post("/ideas", async (req, res) => {
  // TODO: prompt design  + verification + calculate tokens used + times user use this API
  // calling openai

  const { prompt, userid } = req.body;

  let totalcount = 0;
  // console.log(prompt,userid);

  // Calculate total Tokens
  totalcount += tokensCount(prompt);

  try {
    const gptResponse = await openai.complete({
      engine: "ada",
      prompt: prompt.trim(),
      maxTokens: 5,
      temperature: 0.9,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      bestOf: 1,
      n: 1,
      stream: false,
      stop: ["\n", "testing"],
    });
    // console.log(gptResponse.data);
    // res.send(gptResponse.data);
    const responseText = gptResponse.data["choices"][0]["text"];
    const output_label = await contentFilter(responseText);
    totalcount += tokensCount(responseText);
    console.log("output_label:", output_label, "total_token_used:", totalcount);

    if (output_label == "2") {
      res.json({ text: "", message: "unsafe" });
    } else if (output_label == "1") {
      res.json({ text: responseText, message: "sensitive" });
    } else {
      res.json({ text: responseText, message: "safe" });
    }
  } catch (error) {
    console.log("error inside ideas", error);
    res.send("error inside ideas");
  }
});

const PORT = process.env.PORT || 8003;

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
