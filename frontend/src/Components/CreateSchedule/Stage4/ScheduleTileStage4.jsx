import styles from "../create-schedule.module.scss";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SelectInput} from "../../UIKit/SelectInput/SelectInput";
import {DropdownTime} from "./DropdownTime/DropdownTime";
import {
    addScheduleStage4, addToFriday,
    addToMonday, addToSaturday, addToSunday,
    addToThursday,
    addToTuesday,
    addToWednesday
} from "../../../store/createScheduleReducer";

export const ScheduleTileStage4Create = ({day}) => {
    const [name, setName] = useState('')
    const [teacherName, setTeacherName] = useState('')
    const [audName, setAudName] = useState('')
    const [type, setType] = useState('Лекция')
    const [number, setNumber] = useState('')

    const [isVisible, setIsVisible] = useState(false)

    const dispatch = useDispatch()
    const scheduleTimes = useSelector(state => state.createSchedule)

    const [selectedObject, setSelectedObject] = useState(null);

    const handleSelect = (object) => {
        setSelectedObject(object)
    };

    useEffect(() => {
        console.log(selectedObject)
    }, [selectedObject])

    const add = () => {
        console.log('efeo')
        const data = {
            timeStart: selectedObject.timeStart,
            endTime: selectedObject.timeEnd,
            groupName: scheduleTimes.stage3.group?.name || 'unknown',
            audName,
            name,
            teacherName,
            number: selectedObject.number,
            isSubgroup: false,
            type
        }

        switch (day) {
            case 'monday':
                dispatch(addToMonday(data))
                break;
            case 'tuesday':
                dispatch(addToTuesday(data))
                break;
            case 'wednesday':
                dispatch(addToWednesday(data))
                break;
            case 'thursday':
                dispatch(addToThursday(data))
                break;
            case 'friday':
                dispatch(addToFriday(data))
                break;
            case 'saturday':
                dispatch(addToSaturday(data))
                break;
            case 'sunday':
                dispatch(addToSunday(data))
                break;
        }
        clear()
    }

    const clear = () => {
        setName('')
        setTeacherName('')
        setAudName('')
        setType('')
        setSelectedObject(null)
        setIsVisible(false)
    }

    return (
        <div className={styles.stage4tile}>
            {isVisible ?
                <>
                    <p>
                        <div className={styles.field_title}>Название предмета</div>
                        <div className={styles.field_container}>
                            <input onChange={(e) => setName(e.target.value)} value={name}
                                   placeholder={"Название предмета"}/>
                        </div>
                    </p>

                    <p>
                        <div className={styles.field_title}>ФИО преподавателя</div>
                        <div className={styles.field_container}>
                            <input onChange={(e) => setTeacherName(e.target.value)} value={teacherName}
                                   placeholder={"ФИО преподавателя"}/>
                        </div>
                    </p>

                    <div style={{display: 'flex', gap: '1rem'}}>
                        <p>
                            <div className={styles.field_title}>Аудитория</div>
                            <div className={styles.field_container}>
                                <input onChange={(e) => setAudName(e.target.value)} value={audName}
                                       placeholder={"Аудитория"}/>
                            </div>
                        </p>

                        <p>
                            <div className={styles.field_title}>Тип пары</div>
                            <div className={styles.field_container}>
                                <input onChange={(e) => setType(e.target.value)} value={type} placeholder={"Лекция"}/>
                            </div>
                        </p>

                        <p>
                            <div className={styles.field_title}>Номер пары</div>
                            <div className={styles.field_container}>
                                <input onChange={(e) => setNumber(e.target.value)} value={number}
                                       placeholder={"Номер пары"}/>
                            </div>
                        </p>
                    </div>

                    <DropdownTime data={scheduleTimes.allScheduleTimes} onSelect={handleSelect}/>

                    <p>
                        <button onClick={add}>+ Добавить пару</button>
                    </p>
                </>
                :
                <button onClick={() => setIsVisible(true)}>+</button>
            }
        </div>
    )
}