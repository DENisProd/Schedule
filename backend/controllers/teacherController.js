import DstuService from "../services/dstuService.js";

const dstuService = new DstuService()

class teacherController {
    async getSchedule(req, res) {
        const teacherName = req.params.id
        const date = req.query.date
        await dstuService.getTeacherSchedule(teacherName, date)
    }
}

export default teacherController