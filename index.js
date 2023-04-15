require('dotenv').config()

const connecttoMongo = require('./db');
var cors = require('cors')
// require('dotenv').config();
require('dotenv').config()

connecttoMongo();
// console.log("mongo")

const express = require('express')
const app = express()
const port = 8000

app.use(cors())

 // MIDDLEWARE FOR SEEING REQUEST KI BODY
app.use(express.json()) 
// AVAILABLE ROUTES

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))




app.listen(port, () => {
  console.log(`iNotebook backend  listening on http://localhost:${port}`)
  console.log(`port is ${process.env.PORT}`)
  console.log(`port is ${process.env.JWT_SECRET}`)
  console.log(`port is ${process.env.BASE_URL}`)


})

