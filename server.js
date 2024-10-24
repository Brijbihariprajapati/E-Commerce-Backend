require('dotenv').config(); 
const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const router = require('./routers/auth-router')
const dbconnection = require('./utils/db')
const path = require('path')

const app = express()
app.use(cors())
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyparser.json())

app.use('/api/auth',router)
app.use(express.json())


app.get('/',(req,resp)=>{
    resp.json('hello')
})

app.listen(8000,()=>{
    console.log('Server Running On Port:- 8000');
    
})