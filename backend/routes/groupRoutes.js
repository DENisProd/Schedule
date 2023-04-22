import Router from "express"
import GroupController from "../controllers/groupController.js"

const router = new Router()
const groupController = new GroupController()

router.get('/:id', groupController.getOneById)

export default router