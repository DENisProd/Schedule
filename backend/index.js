const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const corsMiddleware = require("./middleware/cors.middleware")

const app = express()
const PORT = config.get("serverPort")

app.use(corsMiddleware)
app.use(express.json())

const start = async () => {
    try {

        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser: true,
        })
            .then(() => console.log('MongoDB connected'))
            .catch(error => console.log(error))


        app.listen(PORT, ()=> {
            console.log("start", PORT)
        })
    } catch (e) {

    }
}

start()