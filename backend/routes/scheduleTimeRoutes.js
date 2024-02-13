import Router from "express";
import rateLimit from "express-rate-limit";
import ScheduleTimeController from "../controllers/scheduleTimeController.js";

const router = new Router()

const scheduleTimeController = new ScheduleTimeController()

const scheduleLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 6, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/', scheduleLimiter, scheduleTimeController.create);

router.get('/:univerId', scheduleTimeController.getAllByUniversity);

router.put('/:id', scheduleTimeController.update);

router.delete('/:id', scheduleLimiter, scheduleTimeController.delete);

export default router