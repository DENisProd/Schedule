import styles from "../create-schedule.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {addScheduleTimeStage2} from "../../../store/createScheduleReducer";

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
        console.log('я тут', index)
        dispatch(addScheduleTimeStage2({
            number,
            startTime,
            endTime
        }))
        setStartTime('')
        setEndTime('')
    }

    return (
        <div className={styles.time_tile}>
            <div>
                {index === undefined ?
                    <>
                        <p>Номер пары: {number}</p>
                        <p>Время начала: <input value={startTime} onChange={(e) => setStartTime(e.target.value)}
                                                type="time" name="startTime"/></p>
                        <p>Время конца: <input value={endTime} onChange={(e) => setEndTime(e.target.value)} type="time"
                                               name="endTime"/></p>
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
                <button>X</button>
                :
                <button onClick={add}>+ Добавить</button>
            }
        </div>
    )
}