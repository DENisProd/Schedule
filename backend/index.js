const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const corsMiddleware = require("./middleware/cors.middleware")
const ClientInfo = require('./models/clientInfo.js')
const requestIp = require('request-ip')
//const cors from 'cors'
//darkadmin
//dark123
const app = express()
const PORT = config.get("serverPort")

app.use(requestIp.mw())
app.use(corsMiddleware)
app.use(express.json())

const parseIp = (req) =>
    req.headers['x-forwarded-for']
    || req.socket.remoteAddress

app.get('/', (req, res) => {
    res.status(200).json({success: "ok"})
})

app.post('/all/', async (req, res) => {
    console.log(req.body)
    try {
        const data = await ClientInfo.find({})
        //res.status(200).json(data)
        if (req.body.pwd === '123_admin_dark')
            res.status(200).json({success: "ok", data: data})
        else
            res.status(200).json({success: "false"});
    } catch (e) {
        console.error(e)
        res.status(400).json({success: "false"});
    }
})


app.post('/stats/', async (req, res) => {
    try {
        const ip = req.clientIp;
        const newClientInfo = new ClientInfo({
            userAgent: req.headers['user-agent'],
            ipAdress: ip,
            searchedGroups: req.body.sg,
            favoriteGroups: req.body.fav,
            enterCount: req.body.count
        })

        await newClientInfo.save()

        return res.status(200).json({success: true})
    } catch (e) {
        console.error(e)
    }
})

const start = async () => {
    try {
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser: true,
        })
            .then(() => console.log('MongoDB connected'))
            .catch(error => console.log(error));
        app.listen(PORT, ()=> {
            console.log("start", PORT)
        })
    } catch (e) {
        console.log("error", e)
    }
}

start()
