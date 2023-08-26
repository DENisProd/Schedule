import styles from "../create-schedule.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {addScheduleTimeStage2, removeScheduleTimeStage2} from "../../../store/createScheduleReducer";

import cn from 'classnames'

export const ScheduleTimeTile = ({index, data}) => {
    const dispatch = useDispatch()
    const stageInfo = useSelector(state => state.createSchedule)

    const [number, setNumber] = useState(index !== undefined ? (index + 1) : (stageInfo.stage2.length + 1))
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    useEffect(() => {
        setNumber(index !== undefined ? (index + 1) : (stageInfo.stage2.length + 1))
    }, [stageInfo.stage2])

    const add = () => {
        dispatch(addScheduleTimeStage2({
            number,
            startTime,
            endTime
        }))
        setStartTime('')
        setEndTime('')
    }

    const remove = () => {
        dispatch(removeScheduleTimeStage2(index))
        setStartTime('')
        setEndTime('')
    }

    return (
        <div className={styles.time_tile}>
            <div className={styles.left}>
                {index === undefined ?
                    <>
                        <p>Номер пары: {number}</p>
                        <p>Время начала: <input value={startTime} onChange={(e) => setStartTime(e.target.value)}
                                                type="time" name="startTime" className={styles.time_input}/></p>
                        <p>Время конца: <input value={endTime} onChange={(e) => setEndTime(e.target.value)} type="time"
                                               name="endTime" className={styles.time_input}/></p>
                    </>
                    :
                    <>
                        <p>Номер пары: {number}</p>
                        <p>Время начала: {data.startTime}</p>
                        <p>Время конца: {data.endTime}</p>
                    </>
                }

            </div>
            {index !== undefined ?
                <button className={cn(styles.small_btn, styles.red)} onClick={remove}>X</button>
                :
                <button onClick={add} className={styles.small_btn}>Сохранить</button>
            }
        </div>
    )
}