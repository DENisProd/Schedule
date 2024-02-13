import Router from "express";
import UniversityController from "../controllers/UniversityController.js";
import rateLimit from "express-rate-limit";

const router = new Router()

const scheduleLimiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 6, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


const universityController = new UniversityController()

router.post('/', scheduleLimiter, universityController.createUniversity)

router.get('/', universityController.getAllUniversities)
router.get('/:id', universityController.getUniversity)
router.get('/type/:type', universityController.getUniversityByType)
router.get('/city/:city', universityController.getUniversityByCity)
router.get('/code/:code', universityController.getOneUniversityByCode)

router.put('/:id', scheduleLimiter, universityController.updateUniversity)
router.delete('/:id', scheduleLimiter, universityController.deleteUniversity)

export default router