import express from 'express'
import mongoose from "mongoose"
import config from "config"
//import corsMiddleware from "./middleware/cors.middleware"
import ClientInfo from './models/clientInfo.js'
import cors from 'cors'
//darkadmin
//dark123
const app = express()
const PORT = config.get("serverPort")

//app.use(corsMiddleware)
app.use(express.json())
app.use(cors());
app.options('*', cors());

const parseIp = (req) =>
    req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress

app.get('/', (req, res) => {
    
})

app.post('/stats/', async (req, res) => {
    try {
        const ipAdress = parseIp(req)
        const newClientInfo = new ClientInfo({
            userAgent: req.headers['user-agent'],
            ipAdress: ipAdress,
            searchedGroups: req.body.sg,
            favoriteGroups: req.body.fav
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
