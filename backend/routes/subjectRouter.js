import Router from "express";
import SubjectController from "../controllers/subjectController.js";

const router = new Router()
const subjectController = new SubjectController()

router.get('/:subjectId', subjectController.getOne)

export default router