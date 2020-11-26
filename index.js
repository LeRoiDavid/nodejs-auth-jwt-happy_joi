const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(bodyParser.json())
// Import router
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')


// Route middleware
// app.use(express.json());
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)



app.listen(process.env.APP_PORT, ()=> { console.log("Server is up and running at port 3000"); })