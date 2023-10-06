import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";

import styles from '../create-schedule.module.scss'
import {ScheduleTimeTile} from "./ScheduleTimeTile";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import {setStage2Action, setStage2FromDbAction} from "../../../store/createScheduleReducer";

export const CreateTimeSchedule = ({_next, back}) => {

    const dispatch = useDispatch()
    const stageInfo = useSelector(state => state.createSchedule)

    const [isCreateVisible, setIsCreateVisible] = useState(true)

    useEffect(() => {
        if (!stageInfo.stage2FromDb) {
            axios.get(URLS.TIME_SCHEDULE + stageInfo.stage1._id).then(res => {
                if (res.data.length > 0) setIsCreateVisible(false)
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

    useEffect(() => {
        if (stageInfo.stage2FromDb) {
            setIsCreateVisible(false)
        }
    }, [])

    const setTimeSchedule = (object) => {
        dispatch(setStage2Action(object.times))
        console.log(object)
        _next()
    }

    return (
        <>
            <p>
                {isCreateVisible ?
                    <span>Теперь заполните расписание звонков для вашего учебного заведения</span>
                :
                    <span>Кто-то уже заполнял расписание звонков вашего учебного заведения. Подходит ли оно вам?</span>
                }
            </p>

            {isCreateVisible ?
                <div>
                    {stageInfo.stage2.map((time, index) =>
                        <ScheduleTimeTile index={index} data={time}/>
                    )}
                    <ScheduleTimeTile/>
                </div>
                :
                <>
                    {Array.isArray(stageInfo.stage2FromDb) && stageInfo.stage2FromDb.map(timeObject =>
                        <div className={styles.exists_time}>
                            <div className={styles.left}>
                                <ul>
                                    {timeObject.times.map(timeRow =>
                                        <div className={styles.time_exists_tile}>
                                            <span>{timeRow.number}</span>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '6fr 1fr 6fr'
                                            }}>
                                                <div>{timeRow.timeStart}</div>
                                                <div>-</div>
                                                <div>{timeRow.timeEnd}</div>
                                            </div>
                                        </div>
                                    )}
                                </ul>
                            </div>
                            <div className={styles.right}>
                                <p>Это ваше расписание звонков?</p>
                                <div style={{display: 'flex', gap: '2rem', justifyContent: 'center'}}>
                                    <button className={styles.small_btn} onClick={() => setTimeSchedule(timeObject)}>Да</button>
                                    <button className={styles.small_btn} onClick={() => setIsCreateVisible(true)}>Нет
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}
                </>
            }

            <div className={styles.button_container}>
                <button className={styles.nextButton} disabled={stageInfo.stage2.length < 2} onClick={next}>Далее
                </button>
            </div>
        </>
    )
}