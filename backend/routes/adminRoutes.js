import Router from "express";
import ClientInfo from "../models/clientInfo.js";
import rateLimit from "express-rate-limit";

const router = new Router()

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

const url = 'http://localhost:3000/send-data';
router.post('/error/', apiLimiter, async (req, res) => {
    console.log('error request')
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body), // Replace { key: 'value' } with your actual data
        });

        if (response.ok) {
            console.log('Data sent successfully');
            res.sendStatus(200);
        } else {
            console.error('Failed to send data:', response.status, response.statusText);
            res.sendStatus(400);
        }
    } catch (error) {
        console.error('Failed to send data:', error);
        res.sendStatus(400);
    }
})

router.post('/all/', admin10, async (req, res) => {
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

router.post('/stats/', apiLimiter, async (req, res) => {
    try {
        const ip = req.clientIp;

        const newClientInfo = new ClientInfo({
            userAgent: req.headers['user-agent'],
            ipAdress: ip,
            author_id: req.body.user_uuid || '',
            enterCount: req.body.count,
            group: req.body.group.toString()
        })

        await newClientInfo.save()

        return res.status(200).json({success: true})
    } catch (e) {
        console.error(e)
    }
})

export default router