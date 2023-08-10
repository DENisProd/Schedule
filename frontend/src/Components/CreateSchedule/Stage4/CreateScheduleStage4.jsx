import {ScheduleTileStage4, ScheduleTileStage4Create} from "./ScheduleTileStage4";
import {DayTileStage4, SubjectTileStage4} from "./DayTileStage4";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import axios from "axios";
import {setAllScheduleTimeAction} from "../../../store/createScheduleReducer";
import {URLS} from "../../../utils/urlsUtils";
import styles from "../create-schedule.module.scss";

const UNIVER_ID = '64d54ddab8e8b60795dba2c8'
const GROUP_ID = '64d54e0db8e8b60795dba2d2'

export const CreateScheduleStage4 = () => {

    const dispatch = useDispatch()
    const schedule = useSelector(state => state.createSchedule)

    const [isEven, setIsEven] = useState(false)
    const onInputChange = (event) => setIsEven(event.target.checked)

    useEffect(() => {
        axios.get(URLS.TIME_SCHEDULE + UNIVER_ID).then(response => {
            dispatch(setAllScheduleTimeAction(response.data))
        })
    }, [])

    const create = () => {
        const data = {
            groupId: GROUP_ID,
            universityId: UNIVER_ID,
            isEven_: isEven,
            days: schedule.stage4
        }
        axios.post(URLS.GET_GROUP_SCHEDULE, data).then(res => {
            console.log(res)
        })
    }

    return (
        <>
            <p>
                Отлично! Теперь можете перейти к заполнению расписания.
            </p>

            <div>
                <h3>Понедельник</h3>
                <div>
                    {schedule.stage4?.monday && schedule.stage4?.monday.map(subject =>
                        <SubjectTileStage4 subject={subject}/>
                    )}
                    <ScheduleTileStage4Create day={'monday'}/>
                </div>

                <h3>Вторник</h3>
                <div>
                    {Array.isArray(schedule.stage4?.tuesday) && schedule.stage4?.tuesday.map(subject =>
                        <SubjectTileStage4 subject={subject}/>
                    )}
                    <ScheduleTileStage4Create day={'tuesday'}/>
                </div>

                <h3>Среда</h3>
                <div>
                    {schedule.stage4?.wednesday && schedule.stage4?.wednesday.map(subject =>
                        <SubjectTileStage4 subject={subject}/>
                    )}
                    <ScheduleTileStage4Create day={'wednesday'}/>
                </div>

                <h3>Четверг</h3>
                <div>
                    {schedule.stage4?.thursday && schedule.stage4?.thursday.map(subject =>
                        <SubjectTileStage4 subject={subject}/>
                    )}
                    <ScheduleTileStage4Create day={'thursday'}/>
                </div>

                <h3>Пятница</h3>
                <div>
                    {schedule.stage4?.friday && schedule.stage4?.friday.map(subject =>
                        <SubjectTileStage4 subject={subject}/>
                    )}
                    <ScheduleTileStage4Create day={'friday'}/>
                </div>

                <h3>Суббота</h3>
                <div>
                    {schedule.stage4?.saturday && schedule.stage4?.saturday.map(subject =>
                        <SubjectTileStage4 subject={subject}/>
                    )}
                    <ScheduleTileStage4Create day={'saturday'}/>
                </div>

                <h3>Воскресенье</h3>
                <div>
                    {schedule.stage4?.sunday && schedule.stage4?.sunday.map(subject =>
                        <SubjectTileStage4 subject={subject}/>
                    )}
                    <ScheduleTileStage4Create day={'sunday'}/>
                </div>

                <p>
                    <label htmlFor="is_odd">Четная неделя</label>
                    <input checked={isEven} id={"is_odd"} type={"checkbox"} onChange={onInputChange}/>
                </p>
                <p>
                    <button className={styles.nextButton} onClick={create}>Далее</button>
                </p>
            </div>

        </>
    )
}