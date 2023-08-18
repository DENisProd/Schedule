import Subject from "../models/subject.js";

class SubjectController {
    getOne = async (req, res) => {
        try {
            const { subjectId } = req.params
            const subject = await Subject.findById(subjectId).populate('group').exec()
            if (!subject) return res.status(404).json({ isError: true, message: 'Предмет не найден' })
            return res.status(200).json(subject)

        } catch (e) {
            return res.status(500).json({ isError: true, message: 'Что-то пошло не так...' })
        }
    }
}

export default SubjectController