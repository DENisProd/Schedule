import cron from "node-cron";

import DstuService from "../services/dstuService.js"
import RsueService from "../services/rsueService.js";
import Week from "../models/weekOfSubjects.js";
import dayjs from "dayjs";
import GroupUploadingSchema from "../models/groupUpdating.js";
import AcademicGroup from "../models/academicGroup.js";
import mongoose from "mongoose";

const dstuService = new DstuService()
const rsueService = new RsueService()

import { DSTU_ID } from "../services/dstuService.js";
import { RSUE_ID } from "../services/rsueService.js";

class CronController {

    async updateRSUEGroups() {
        try {
            const rsueFromDb = await AcademicGroup.find({university: RSUE_ID})
            if (rsueFromDb) await AcademicGroup.deleteMany({university: RSUE_ID})
            console.log('RSUE groups are deleted')
            await rsueService.removeWeek()
            await rsueService.getGroupsFromServer()
            console.log('RSUE groups are updated')
        } catch (e) {
            console.log(e)
        }
    }

    async updateDSTUGroups() {
        try {
            const dstuFromDb = await AcademicGroup.find({university: DSTU_ID})
            if (dstuFromDb) await AcademicGroup.deleteMany({university: DSTU_ID})
            console.log('DSTU groups are deleted')
            await dstuService.getGroupsFromServer()
            console.log('DSTU groups are updated')
        } catch (e) {
            console.log(e)
        }
    }

    async updateRSUESchedule() {
        rsueService.removeWeek().then(async res => {
            await rsueService.removeWeek()
        })
    }

    async updateDSTUSchedule() {
        console.log('Задача выполнена в 01:00:00');

        const monday = dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DDTHH:mm:ss')
        const mondayNext = dayjs().startOf('week').add(8, 'day').format('YYYY-MM-DDTHH:mm:ss')
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

        dstuService.removeWeek(mondayNext).then(async res => {
            const groups = await GroupUploadingSchema.find({})
            const data = await Promise.all(
                groups.map(async gr => {
                    console.log('getting data')
                    return await dstuService.getWeekIdScheduleFromServer(Number.parseInt(gr.groupID), mondayNext)
                    // return await dstuService.getWeekScheduleByGroupIdAndDate(Number.parseInt(gr.groupID), monday)
                })
            )
        })


    }

    init() {
        // this.updateDSTUSchedule().then(r => console.log('then'))
        this.updateRSUEGroups()
        // this.updateDSTUGroups()
        this.updateDSTUSchedule()
        // Задача будет выполняться в 00:00, 7:00 утра и 3:00 дня (15:00)
        cron.schedule('0 0,7,15 * * *', this.updateDSTUSchedule);
    }
}

export default CronController