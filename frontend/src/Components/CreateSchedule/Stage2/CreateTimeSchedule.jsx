import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

import styles from '../create-schedule.module.scss'
import {ScheduleTimeTile} from "./ScheduleTimeTile";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import {setStage2FromDbAction} from "../../../store/createScheduleReducer";

export const CreateTimeSchedule = ({_next}) => {

    const dispatch = useDispatch()
    const stageInfo = useSelector(state => state.createSchedule)

    const next = () => {
        axios.post(URLS.TIME_SCHEDULE, {
            schedule: stageInfo.stage2,
            university: stageInfo.stage1._id,
            author_id: localStorage.getItem('clientId')
        }).then(res => {
            dispatch(setStage2FromDbAction(res.data))
            _next()
        })
    }

    return (
        <>
            <p>
                <span>Теперь заполните расписание звонков для вашего учебного заведения</span>
            </p>

            <div>
                {stageInfo.stage2.map((time, index) =>
                    <ScheduleTimeTile index={index} data={time}/>
                )}
                <ScheduleTimeTile/>
            </div>

            <p>
                <button className={styles.nextButton} onClick={next}>Далее</button>
            </p>
        </>
    )
}