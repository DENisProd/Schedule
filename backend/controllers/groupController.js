import Group from "../models/group.js"

import DstuService from "../services/dstuService.js"
import {UNIVERSITIES} from "../constants/Universities.js";
import Week from "../models/weekOfSubjects.js";

const dstuService = new DstuService()

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
                            const weekSchedule = await dstuService.getWeekScheduleById(week_id)

                            res.send({weekSchedule})
                        }
                        break
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