import AcademicGroup from "../models/academicGroup.js";
import University from "../models/university.js";

class AcademicGroupController {
    create = async (req, res) => {
        try {
            const univer = University.findById(req.body.university)

            if (univer) {
                const group = new AcademicGroup({
                    faculty: req.body.faculty,
                    name: req.body.name,
                    level: Number.parseInt(req.body.level),
                    university: req.body.university,
                    groupID: Number(req.body.groupID) || 0
                })
                await group.save()
                return res.status(201).json({message: 'Группа успешно создана', group})
            }
            return res.status(400).json({message: 'Произошла ошибка при создании группы'})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Произошла ошибка при создании группы'})
        }
    }

    getOne = async (req,res) => {
        try {
            const group = await AcademicGroup.findById(req.params.groupId).populate('university').exec()
            if (!group) return res.status(404).json({ isError: true, message: 'Группа не найдена' })
            return res.status(200).json(group)
        } catch (e) {
            console.log(e)
            return res.status(500).json({ isError: true, message: 'что-то пошло не так...' })
        }
    }

    getAll = async (req, res) => {
        try {
            const groups = await AcademicGroup.find({})

            return res.status(200).json({...groups})
        } catch (e) {
            return res.status(400).json({message: 'Произошла ошибка при получении групп'})
        }
    }

    getByUniversity = async (req, res) => {
        try {
            const univer = await University.findById(req.params.univerId)
            if (univer) {
                const groups = await AcademicGroup.find({ university: univer._id})
                if (groups) return res.status(200).json({...groups})

                return res.status(404).json({message: 'Не найдено групп для данного учебного заведения'})
            }
            res.status(404).json({ error: 'Учебное заведение не найдено' });
        } catch (e) {
            return res.status(400).json({message: 'Произошла ошибка при получении групп'})
        }
    }

    getByUniversityCode = async (req, res) => {
        try {
            const univer = await University.findOne({ code: req.params.code.toUpperCase() })
            if (univer) {
                const groups = await AcademicGroup.find({ university: univer._id}).lean()
                if (groups) {
                    return res.status(200).json(groups);
                } else {
                    return res.status(404).json({message: 'Не найдено групп для данного учебного заведения'})
                }

                return res.status(404).json({message: 'Не найдено групп для данного учебного заведения'})
            }
            res.status(404).json({ error: 'Учебное заведение не найдено' });
        } catch (e) {
            return res.status(400).json({message: 'Произошла ошибка при получении групп'})
        }
    }

    getByFaculty = async (req, res) => {
        try {
            console.log(req.params.faculty)
                const groups = await AcademicGroup.find({ faculty: req.params.faculty})
                if (groups) return res.status(200).json({...groups})

                return res.status(404).json({message: 'Не найдено групп для данного факультета'})
        } catch (e) {
            return res.status(400).json({message: 'Произошла ошибка при получении групп'})
        }
    }
}

export default AcademicGroupController