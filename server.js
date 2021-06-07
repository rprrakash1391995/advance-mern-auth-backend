const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
require('./connectionDB/mongoose')
const errorHandler = require('./middleware/error')

app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/private', require('./routes/Private'))
app.use(errorHandler);

const port = process.env.PORT || 3000

const server= app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged error ${err}`)
    server.close(process.exit(1))
})