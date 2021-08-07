const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:String,
    password:String,
    googleId:String,
    thumbnail:String,
    billingID: String,
    plan: { type: String, enum: ["none", "basic", "pro"], default: "none" },
    hasTrial: { type: Boolean, default: false },
    endDate: { type: Date, default: null },
    refreshToken:String,
    created:{type:Date,default:Date.now()},
    
})

const User = mongoose.model("users",userSchema)

module.exports = User;