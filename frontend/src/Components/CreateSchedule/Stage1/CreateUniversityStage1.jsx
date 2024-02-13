import styles from '../create-schedule.module.scss'
import {URLS} from "../../../utils/urlsUtils";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setStage1Action} from "../../../store/createScheduleReducer";
import {SelectInput} from "../../UIKit/SelectInput/SelectInput";
import {Dropdown} from "../../UIKit/DropdownNew/Dropdown";
import {BLOCKED_CREATE_UNIVERSITY} from "../../CreateTest/CreateTest";

export const CATEGORIES = [
    {optionName: 'Высшее учебное заведение', value: 'UNIVERSITY'},
    {optionName: 'Колледж', value: 'COLLEGE'},
    {optionName: 'Школа', value: 'SCHOOL'},
    {optionName: 'Другое', value: 'ORGANIZATION'},
]

export const CreateUniversityStage1 = ({_next}) => {
    const [fullName, setFullName] = useState(null)
    const [shortName, setShortName] = useState(null)
    const [city, setCity] = useState(null)
    const [type, setType] = useState(CATEGORIES[0])
    const [urlAddress, setUrlAddress] = useState(null)
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])

    const [isCreate, setIsCreate] = useState(false)

    const [universitiesFullName, setUniversitiesFullName] = useState([])
    const [university, setUniversity] = useState(null)

    const dispatch = useDispatch()
    const stage = useSelector(state => state.createSchedule)

    useEffect(() => {
        const uuid = localStorage.getItem('clientId') || 0
        axios.get(URLS.UNIVERSITY +'?user='+uuid).then(res => {
            let _un2 = {};
            let arr = []

            if (Array.isArray(res.data)) {
                res.data.forEach(univer => {
                    arr.push({
                        ...univer,
                        optionName: univer.full_name
                    })
                    const code = univer?.code?.toLowerCase()
                    //if (!university) setUniversity(code)
                    if (code) {
                        _un2[code] = univer.full_name
                    }
                })
                arr = arr.filter(univer => !BLOCKED_CREATE_UNIVERSITY.includes(univer.code))
                setData(arr)
                setFilteredData(arr.filter(u => u.type === type.value))
                setUniversitiesFullName(_un2)
            }
        });
    }, [])

    const typeHandler = (value) => {
        setType(value)
        setFilteredData(data.filter(u => u.type === value.value))
    }

    const nextExist = () => {
        axios.get(URLS.UNIVERSITY + 'code/' + university.code).then(res => {
            dispatch(setStage1Action(res.data))
            _next()
        })
    }

    const nextCreate = () => {
        console.log('create')
        axios.post(URLS.UNIVERSITY, {
            full_name: fullName,
            short_name: shortName,
            city: city,
            type: type.value,
            url: urlAddress,
            author_id: localStorage.getItem('clientId')
        }).then(res => {
            dispatch(setStage1Action(res.data))
            _next()
        })
    }

    const onSelectUniversity = (value) => {
        setUniversity(value)
    }

    useEffect(() => {
        console.log(!(fullName === null && shortName === null && city === null && type === null))
    }, [city, type, fullName, shortName])

    return (
        <>
            {isCreate ?
                <>
                    <div className={styles.grid_block}>
                        <button onClick={() => setIsCreate(prevState => !prevState)}
                                className={styles.micro_btn}>Назад
                        </button>
                        <span>Создайте организацию</span>
                    </div>
                    <p>
                        <div className={styles.field_title}>Выберите тип учебного заведения</div>
                        <Dropdown selectedValue={type} optionList={CATEGORIES} defaultValue={CATEGORIES[0]} placeholder={"Выберите тип"}
                                  setSelectedValue={typeHandler}/>

                    </p>
                    <p>
                        <div className={styles.field_title}>Полное название</div>
                        <div className={styles.field_container}>
                            <input onChange={(e) => setFullName(e.target.value)}
                                   placeholder={"Донской государственный технический университет"}/>
                        </div>
                    </p>

                    <p>
                        <div className={styles.field_title}>Сокращенное название</div>
                        <div className={styles.field_container}>
                            <input onChange={(e) => setShortName(e.target.value)} placeholder={"ДГТУ"}/>
                        </div>
                    </p>

                    <p>
                        <div className={styles.field_title}>Адрес сайта</div>
                        <div className={styles.field_container}>
                            <input value={urlAddress} onChange={(e) => setUrlAddress(e.target.value)}
                                   placeholder={"https://donstu.ru/"}/>
                        </div>
                    </p>

                    <p>
                        <div className={styles.field_title}>Город</div>
                        <div className={styles.field_container}>
                            <input onChange={(e) => setCity(e.target.value)} placeholder={"Ростов-на-Дону"}/>
                        </div>
                    </p>

                    <p>
                        <button
                            className={styles.nextButton}
                            onClick={nextCreate}
                            disabled={!(fullName && shortName && city && type && urlAddress)}
                        >
                            Далее
                        </button>
                    </p>
                </>
                :
                <>
                    <p>
                        <span>Для начала выберете тип учебного заведения.</span>
                    </p>
                    <p>
                        <span>Вам нужно выбрать или создать учебное заведение, чтобы вы имели возможность поделиться созданным расписанием с друзьями.</span>
                    </p>
                    {/*<SelectInput options={CATEGORIES} value={CATEGORIES["UNIVERSITY"]} onChange={setType}*/}
                    {/*             placeholder={"Выберете тип создания"}/>*/}
                    <Dropdown selectedValue={type} optionList={CATEGORIES} defaultValue={CATEGORIES[0]} placeholder={"Выберите тип"}
                              setSelectedValue={typeHandler}/>
                    {Array.isArray(filteredData) &&
                        <Dropdown selectedValue={university} optionList={filteredData} defaultValue={filteredData[0]}
                                  placeholder={"Выберите учебное заведение"} setSelectedValue={setUniversity}/>
                    }
                    {/*<SelectInput options={universitiesFullName}*/}
                    {/*             value={universitiesFullName[university]}*/}
                    {/*             onChange={onSelectUniversity}*/}
                    {/*             */}
                    {/*/>*/}
                    <div>
                        <span>Если вашей организации нет в списке, то </span>
                        <button className={styles.micro_btn}
                                onClick={() => setIsCreate(prevState => !prevState)}>Создайте
                        </button>
                    </div>
                    <p>
                        <button
                            className={styles.nextButton}
                            onClick={nextExist}
                            disabled={university === null}
                        >Далее
                        </button>
                    </p>
                </>
            }


        </>
    )
}