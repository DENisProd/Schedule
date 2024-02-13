import Router from "express";
import AuthController from "../controllers/authController.js";

const router = new Router()
const authController = new AuthController()

router.get('/', authController.index)
router.get('/vk', authController.vkStart)
router.get('/ya', authController.yaStart)
router.get('/login/success', authController.success)
router.get('/login/failed', authController.failed)
router.get('/vk/callback', authController.vkCallback)
router.get('/ya/callback', authController.yaCallback)
router.get('/logout', authController.logout)

export default router