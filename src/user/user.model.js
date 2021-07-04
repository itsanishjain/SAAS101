const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  billingID: String,
  plan: { type: String, enum: ["none", "basic", "pro"], default: "none" },
  hasTrial: { type: Boolean, default: false },
  endDate: { type: Date, default: null },
  created: { type: Date, default: Date.now() },
});


const userModel = mongoose.model("User", UserSchema);

// exporting a function
module.exports = userModel;

