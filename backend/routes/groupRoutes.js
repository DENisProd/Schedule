import Router from "express"
import GroupController from "../controllers/groupController.js"
import rateLimit from "express-rate-limit";

const router = new Router()
const groupController = new GroupController()

const scheduleLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 6, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.get('/:id', scheduleLimiter, groupController.getOneById)
router.get('/all/:univer', scheduleLimiter, groupController.getAllForUniversity)

export default router