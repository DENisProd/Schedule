import Router from "express";
import rateLimit from "express-rate-limit";
import AcademicGroupController from "../controllers/academicGroupController.js";

const router = new Router()
const academicGroupController = new AcademicGroupController()

const scheduleLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 2, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/', scheduleLimiter, academicGroupController.create)
router.get('/', academicGroupController.getAll)
router.get('/univer/:univerId', academicGroupController.getByUniversity)
router.get('/code/:code', academicGroupController.getByUniversityCode)
router.get('/faculty/:faculty', academicGroupController.getByFaculty)

export default router