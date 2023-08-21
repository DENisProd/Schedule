import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";

import styles from '../create-schedule.module.scss'
import {ScheduleTimeTile} from "./ScheduleTimeTile";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import {setStage2FromDbAction} from "../../../store/createScheduleReducer";

export const CreateTimeSchedule = ({_next}) => {

    const dispatch = useDispatch()
    const stageInfo = useSelector(state => state.createSchedule)

    const [isCreateVisible, setIsCreateVisible] = useState(true)

    useEffect(() => {
        console.log(stageInfo.stage2FromDb)
        if (!stageInfo.stage2FromDb) {
            axios.get(URLS.TIME_SCHEDULE + stageInfo.stage1._id).then(res => {
                if (res.data.length > 0) {
                    setIsCreateVisible(false)
                }
                dispatch(setStage2FromDbAction(res.data))
            })
        }
    }, [stageInfo])

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

            {isCreateVisible ?
                <div>
                    {stageInfo.stage2.map((time, index) =>
                        <ScheduleTimeTile index={index} data={time}/>
                    )}
                    <ScheduleTimeTile/>
                </div>
                :
                <div style={{display: 'flex', marginBottom: '1rem'}}>
                    <div style={{width: '30%'}}>
                        <ul>
                            {Array.isArray(stageInfo.stage2FromDb) && stageInfo.stage2FromDb.map(timeRow =>
                                <li style={{display: 'grid', gridTemplateColumns: '1fr 6fr'}}>
                                    <span>{timeRow.number}</span>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '5fr 1fr 5fr'
                                    }}>
                                        <div>{timeRow.timeStart}</div>
                                        <div>-</div>
                                        <div>{timeRow.timeEnd}</div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div style={{width: '50%'}}>
                        <p>Это ваше расписание звонков?</p>
                        <div style={{display: 'flex', gap: '2rem', justifyContent: 'center'}}>
                            <button className={styles.small_btn} onClick={_next}>Да</button>
                            <button className={styles.small_btn} onClick={() => setIsCreateVisible(true)}>Нет
                            </button>
                        </div>

                    </div>
                </div>
            }


            <p>
                <button className={styles.nextButton} onClick={next}>Далее</button>
            </p>
        </>
    )
}