const mongoose = require('mongoose')
const URL = process.env.MONGODB_URL
const dbconnection = mongoose.connect(URL).then(()=>console.log('Database connected succesfully')
).catch((err)=>console.log('Connection Failed',err)
)

module.exports = {dbconnection}