import Router from "express";
import { v4 } from 'uuid'
import rateLimit from "express-rate-limit";
import userMiddleware from "../middleware/user.middleware.js";
import UserController from "../controllers/userController.js";



const router = new Router()
const userController = new UserController()

const scheduleLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 6, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/me', scheduleLimiter, userController.getMe)
router.post('/allusers', scheduleLimiter, userController.getAllUsers)


export default router