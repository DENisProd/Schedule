import Router from "express"
import GroupController from "../controllers/groupController.js"
import rateLimit from "express-rate-limit";
import {UNIVERSITIES} from "../constants/Universities.js";

const router = new Router()
const groupController = new GroupController()

const scheduleLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 16, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const scheduleCreateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/compare/', scheduleLimiter, groupController.getCompare)
router.get('/:id', scheduleLimiter, async (req, res) => {
    const {university, date} = req.query
    const groupId = req.params.id

    const data = await groupController.getOneById(groupId, university, date)

    if (data === 404)
        res.status(404).json({message: 'Группа не найдена'})
    else if (data === 500)
        res.status(500).json({message: "Ошибка при получении группы"})
    else
        res.status(200).json({...data})
})
router.get('/all/:univer', scheduleLimiter, groupController.getAllForUniversity)
router.post('/', scheduleCreateLimiter, groupController.createSchedule)

export default router