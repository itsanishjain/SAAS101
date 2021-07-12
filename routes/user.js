const router = require('express').Router()


//get dashboard
router.get("/dashboard",(req,res)=>{
    res.render("dashboard")
})

module.exports =  router;