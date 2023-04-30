import cron from "node-cron";

import DstuService from "../services/dstuService.js"
import RsueService from "../services/rsueService.js";
import Week from "../models/weekOfSubjects.js";
import dayjs from "dayjs";
import GroupUploadingSchema from "../models/groupUpdating.js";

const dstuService = new DstuService()
const rsueService = new RsueService()

class CronController {
    async updateDSTUSchedule() {
        console.log('Задача выполнена в 01:00:00');

        const monday = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ss')
        dstuService.removeWeek(monday).then(async res => {
            const groups = await GroupUploadingSchema.find({})
            const data = await Promise.all(
                groups.map(async gr => {
                    console.log('getting data')
                    return await dstuService.getWeekIdScheduleFromServer(Number.parseInt(gr.groupID), monday)
                    // return await dstuService.getWeekScheduleByGroupIdAndDate(Number.parseInt(gr.groupID), monday)
                })
            )
        })


    }

    init() {
        // this.updateDSTUSchedule().then(r => console.log('then'))
        cron.schedule('0 1 * * *', this.updateDSTUSchedule);
    }
}

export default CronController