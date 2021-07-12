const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: "smtp.mailazy.com",
  port: 587,
  auth: {
    user: process.env.MAILAZY_KEY,
    pass: process.env.MAILAZY_SECRET,
  },
  authMethod: "LOGIN",
  secure: true,
  secureConnection: true,
  requiresAuth: true,
});

const message = {
  from: "sender@sneaks.ml", // Sender address
  to: "helloanishjain@gmail.com", // recipient address
  subject: "Hello! from saas101", // Subject line
  text: "Hello world!", // Plain text body
  html: "<b>Hello world!</b> <a href='https://developers.google.com/identity/sign-in/web/sign-in'></a>", // HTML body
};
transport.sendMail(message, function (err, info) {
  console.log("here");
  if (err) {
    console.log(err);
  } else {
    console.log(info);
  }
});




async function main() {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailazy.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILAZY_KEY, 
      pass: process.env.MAILAZY_SECRET,
    },
  });

  let info = await transporter.sendMail({
    from: "sender@sneaks.ml", // sender address
    to: "helloanishjain@gmail.com", // list of receivers
    subject: "click me", // Subject line
    text: "Hello world?", // plain text body
    html: "<a href='https://jwt.io/'>Click me</a>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

// main().catch(console.error);