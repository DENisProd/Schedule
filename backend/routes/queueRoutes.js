import Router from "express";
import rateLimit from "express-rate-limit";
import QueueController from "../controllers/queueController.js";

const router = new Router()
const queueController = new QueueController()

const scheduleLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 6, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/', scheduleLimiter, queueController.create)
router.post('/subscribe/:queueId', scheduleLimiter, queueController.addMember)
router.get('/:queueId', queueController.getOne)
router.get('/group/:groupId', queueController.getAllByGroup)
router.post('/delete/:queueId', scheduleLimiter, queueController.deleteOne)


export default router