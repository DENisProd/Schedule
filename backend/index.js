const express = require("express")
const mongoose = require("mongoose")
const config = require("config")
const corsMiddleware = require("./middleware/cors.middleware")
const ClientInfo = require('./models/clientInfo.js')
const requestIp = require('request-ip')
const rateLimit = require('express-rate-limit')
//const cors from 'cors'

const app = express()
const PORT = config.get("serverPort")

const apiLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 15 minutes
    max: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const admin10 = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 5 create account requests per `window` (here, per hour)
    message:
        'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(requestIp.mw())
app.use(corsMiddleware)
app.use(express.json())

const parseIp = (req) =>
    req.headers['x-forwarded-for']
    || req.socket.remoteAddress


app.post('/all/', admin10, async (req, res) => {
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

app.post('/stats/', apiLimiter, async (req, res) => {
    try {
        const ip = req.clientIp;
        const newClientInfo = new ClientInfo({
            userAgent: req.headers['user-agent'],
            ipAdress: ip,
            searchedGroups: req.body.sg,
            favoriteGroups: req.body.fav,
            enterCount: req.body.count,
            group: req.body.group
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
