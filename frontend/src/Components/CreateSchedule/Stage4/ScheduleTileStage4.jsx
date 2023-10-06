import styles from "../create-schedule.module.scss";
import React, {useEffect, useRef, useState} from "react";
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
import {Dropdown} from "../../UIKit/DropdownNew/Dropdown";

export const ScheduleTileStage4Create = ({day}) => {
    const [name, setName] = useState('')
    const [teacherName, setTeacherName] = useState('')
    const [audName, setAudName] = useState('')
    const [type, setType] = useState('Лекция')
    const [number, setNumber] = useState('')
    const [timeList, setTimeList] = useState([])

    const [namesList, setNamesList] = useState([])
    const [teacherNamesList, setTeacherNamesList] = useState([])

    const [isVisible, setIsVisible] = useState(true)

    const dispatch = useDispatch()
    const scheduleTimes = useSelector(state => state.createSchedule)

    const [selectedObject, setSelectedObject] = useState(null);

    const handleSelect = (object) => setSelectedObject(object)

    const nameRef = useRef(null)
    const teacherNameRef = useRef(null)

    useEffect(() => {
        let obj = []
        scheduleTimes.stage2.map(time => {
            obj.push({
                ...time,
                optionName:  `${time.number} пара     ${time.timeStart}-${time.timeEnd}`
            })
        })
        setTimeList(obj)
    }, [scheduleTimes.stage2FromDb])

    const add = () => {
        console.log(selectedObject)
        if (selectedObject) {
            const data = {
                timeStart: selectedObject.timeStart,
                endTime: selectedObject.timeEnd,
                groupName: scheduleTimes.stage3.group?.name || 'unknown',
                audName,
                name: name.value,
                teacherName: teacherName.value,
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
            setTimeout(() => {
                clear();
            }, 0);
        }
    }

    const clear = () => {
        setName(null)
        setTeacherName(null)
        setAudName('')
        setType('')
        setSelectedObject(null)
        nameRef.current.clear()
        // setIsVisible(false)
    }

    const nameHandler = (e) => setName(e)
    const teacherNameHandler = (e) => setTeacherName(e)

    useEffect(() => {
        getAllByField('name')
        getAllByField('teacherName')
    }, [scheduleTimes.stage4])

    const getAllByField = (field) => {
        const uniqueNamesSet = new Set();

        Object.values(scheduleTimes.stage4).forEach(dayData => {
            dayData.forEach(item => {
                if (item[field]) {
                    uniqueNamesSet.add(item[field]);
                }
            });
        });

        const uniqueNamesArray = Array.from(uniqueNamesSet)
        let options = []
        uniqueNamesArray.forEach(item => {
            options.push({ optionName: item, value: item})
        })

        switch (field) {
            case 'name': setNamesList(options)
                break
            case 'teacherName': setTeacherNamesList(options)
                break
        }

        return uniqueNamesArray
    }

    return (
        <div className={styles.stage4tile}>
            {isVisible ?
                <>
                    <div>
                        <div className={styles.field_title}>Название предмета</div>
                        <div className={styles.field_container}>
                            {/*<input onChange={nameHandler} value={name} placeholder={"Название предмета"}/>*/}
                            <Dropdown ref={nameRef} invertedColor={true} optionList={namesList} canWrite={true} placeholder={"Название предмета"} setSelectedValue={nameHandler} selectedValue={name} isDisplayEmpty={false}/>
                        </div>
                    </div>

                    <div>
                        <div className={styles.field_title}>ФИО преподавателя</div>
                        <div className={styles.field_container}>
                            {/*<input onChange={(e) => setTeacherName(e.target.value)} value={teacherName} placeholder={"ФИО преподавателя"}/>*/}
                            <Dropdown ref={teacherNameRef} invertedColor={true} optionList={teacherNamesList} canWrite={true} placeholder={"ФИО преподавателя"} setSelectedValue={teacherNameHandler} selectedValue={teacherName} isDisplayEmpty={false}/>
                        </div>
                    </div>

                    <div className={styles.tripple_container}>
                        <div className={styles.child}>
                            <div className={styles.field_title}>Аудитория</div>
                            <div className={styles.field_container}>
                                <input onChange={(e) => setAudName(e.target.value)} value={audName}
                                       placeholder={"Аудитория"}/>
                            </div>
                        </div>

                        <div className={styles.child}>
                            <div className={styles.field_title}>Тип пары</div>
                            <div className={styles.field_container}>
                                <input onChange={(e) => setType(e.target.value)} value={type} placeholder={"Лекция"}/>
                            </div>
                        </div>

                        <div className={styles.child}>
                            <div className={styles.field_title}>Номер пары</div>
                            <Dropdown invertedColor={true} optionList={timeList} placeholder={"Выберете время"} setSelectedValue={handleSelect} selectedValue={selectedObject} isDisplayEmpty={false}/>
                        </div>
                    </div>

                    {/* <DropdownTime data={scheduleTimes.allScheduleTimes} onSelect={handleSelect}/> */}

                    <p style={{
                        textAlign: 'center'
                    }}>
                        <button className={styles.nextButton} style={{
                            width: '50%'
                        }} onClick={add} disabled={!(name.value && teacherName.value && selectedObject && audName && type)}>Сохранить пару</button>
                    </p>
                </>
                :
                <button onClick={() => setIsVisible(true)} className={styles.small_btn}>+</button>
            }
        </div>
    )
}