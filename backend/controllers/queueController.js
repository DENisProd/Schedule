import AcademicGroup from "../models/academicGroup.js";
import Subject from "../models/subject.js";
import Queue from "../models/queue.js";
import User from "../models/user.js";

class QueueController {
    create = async (req, res) => {
        try {
            const { subjectId, groupId, userUid, startTime } = req.body

            const groupFromDb = await AcademicGroup.findById(groupId)
            if (!groupFromDb) return res.status(404).json({ isError: true, message: 'Группа не найдена' })

            const subjectFromDb = await Subject.findById(subjectId)
            if (!subjectFromDb) return res.status(404).json({ isError: true, message: 'Предмет не найден' })

            const userFromDb = await User.findOne({ clientId: userUid })
            if (!userFromDb) return res.status(404).json({ isError: true, message: 'Пользователь не найден' })

            const queue = new Queue({
                group: groupId,
                subject: subjectId,
                author: userFromDb._id,
                startTime: new Date(startTime)
            })

            await queue.save()
            return res.status(201).json({ isError: false, ...queue})

        } catch (e) {
            console.log(e)
            return res.status(400).json({
                isError: true,
                message: e
            })
        }
    }

    addMember = async (req, res) => {
        try {
            const { queueId } = req.params
            const { userUUID, name } = req.body

            const queue = await Queue.findById(queueId)
            if (!queue) return res.status(404).json({ isError: true, message: 'Очередь не найдена' })

            queue.members.push({
                userUUID,
                name,
                number: queue.members.length - 1
            })

            await queue.save()
            return res.status(200).json({ isError: false, queue})
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                isError: true,
                message: e
            })
        }
    }

    getAllByGroup = async (req, res) => {
        try {
            const { groupId } = req.params
            const groupFromDb = await AcademicGroup.findById(groupId)
            if (!groupFromDb) return res.status(404).json({ isError: true, message: 'Группа не найдена' })

            const queues = await Queue.find({ group: groupId })

            return res.status(200).json({ isError: false, queues})
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                isError: true,
                message: e
            })
        }
    }

    getOne = async (req, res) => {
        try {
            const { queueId } = req.params

            const queue = await Queue.findById(queueId)
            if (!queue) return res.status(404).json({ isError: true, message: 'Очередь не найдена' })

            return res.status(200).json({ isError: false, queue})
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                isError: true,
                message: e
            })
        }
    }

    deleteOne = async (req, res) => {
        try {
            const { queueId } = req.params
            const { userUUID } = req.body

            const queue = await Queue.findById(queueId)

            if (!queue) {
                return res.status(404).json({isError: true, message: "Очередь не найдена"})
            }

            if (queue.author !== userUID) {
                return res.status(403).json({isError: true, message: "Действие запрещено"})
            }

            const deletedQueue = await Queue.findByIdAndDelete(req.params.queueId)
            return res.status(200).json({ isError: false, message: "Очередь успешно удалена"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({
                isError: true,
                message: e
            })
        }
    }
}

export default QueueController