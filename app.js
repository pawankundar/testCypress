const express = require("express")
const app = express()

app.get("/",(req,res)=>{
    res.status(201).send()
})

app.listen(8084,()=>{
    console.log("server")
})