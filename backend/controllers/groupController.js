import DstuService from "../services/dstuService.js"
import {UNIVERSITIES} from "../constants/Universities.js";
import RsueService from "../services/rsueService.js";

const dstuService = new DstuService()
const rsueService = new RsueService()

Date.prototype.getWeek = function() {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    const daysSinceFirstDayOfYear = (this - firstDayOfYear) / 86400000;
    return Math.ceil((daysSinceFirstDayOfYear + firstDayOfYear.getDay() + 1) / 7);
};


class groupController {

    async getOneById(req, res) {
        try {
            const {university, date} = req.query
            const groupId = req.params.id

            console.log(groupId)
            console.log(university)

            if (groupId) {
                switch (university) {
                    case UNIVERSITIES.DSTU: {
                        const week = await dstuService.getWeekScheduleByGroupId(groupId)

                        if (week) {
                            console.log("is exists in db")
                            res.send({week})
                        } else {
                            console.log("not exists in db")
                            const week_id = await dstuService.getWeekIdScheduleFromServer(groupId)

                            if (week_id) {
                                const weekSchedule = await dstuService.getWeekScheduleById(week_id)
                                res.send({weekSchedule})
                            } else
                                res.status(404).json({message: 'Группа не найдена'})

                        }
                        break
                    }
                    case UNIVERSITIES.RSUE: {
                        await rsueService.fetchCurses(3)
                        const schedule = await rsueService.parseSchedule(3,3,2)
                        const date = new Date()
                        const weekNumber = Number.parseInt(date.getWeek())
                        console.log(weekNumber)
                        const sch = await rsueService
                            // .getSchedule(weekNumber % 2 === 0 ? schedule[1] : schedule[0], groupId)
                            .getSchedule(weekNumber, groupId)

                        if (sch)
                            res.send({sch})
                        else
                            res.status(404).json({message: 'Группа не найдена'})
                    }
                    default:
                        console.log("def")
                        break
                }

                // Week.findOne({groupID: groupId}, async (err, week) => {
                //     if (err) {
                //         console.error(err);
                //     } else if (week) {
                //         console.log(week.id);
                //         const weekSchedule = await dstuService.getWeekScheduleById(week_id)
                //
                //         res.send({weekSchedule})
                //     } else {
                //         console.log('group not found');
                //         let data = {}
                //         switch (university) {
                //             case UNIVERSITIES.DSTU:
                //                 console.log("DSTU")
                //                 const week_id = await dstuService.getWeekIdScheduleFromServer(groupId)
                //                 const weekSchedule = await dstuService.getWeekScheduleById(week_id)
                //
                //                 res.send({weekSchedule})
                //                 break
                //             default:
                //                 console.log("def")
                //                 break
                //         }
                //     }
                // })
            }

        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Ошибка при получении группы"})
        }
    }
}

export default groupController