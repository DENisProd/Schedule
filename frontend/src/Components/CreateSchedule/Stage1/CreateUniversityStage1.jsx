import styles from '../create-schedule.module.scss'
import {URLS} from "../../../utils/urlsUtils";
import axios from "axios";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setStage1Action} from "../../../store/createScheduleReducer";

export const CreateUniversityStage1 = ({_next}) => {
    const [fullName, setFullName] = useState(null)
    const [shortName, setShortName] = useState(null)
    const [city, setCity] = useState(null)
    const [type, setType] = useState(null)

    const dispatch = useDispatch()
    const stage = useSelector(state => state.createSchedule)

    useEffect(() => {
        axios.get(URLS.UNIVERSITY).then(res => {

        })
    }, [])

    const next = () => {
        axios.post(URLS.UNIVERSITY, {
            full_name: fullName,
            short_name: shortName,
            city: city,
            type: type,
            author_id: localStorage.getItem('clientId')
        }).then(res => {
            dispatch(setStage1Action(res.data))
            _next()
        })
    }

    return (
        <>
            <p>
                <span>Для начала создайте своё учебное заведение</span>
            </p>

            <p>
                <div className={styles.field_title}>Полное название</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setFullName(e.target.value)} placeholder={"Донской государственный технический университет"}/>
                </div>
            </p>

            <p>
                <div className={styles.field_title}>Сокращенное название</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setShortName(e.target.value)} placeholder={"ДГТУ"}/>
                </div>
            </p>

            <p>
                <div className={styles.field_title}>Город</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setCity(e.target.value)} placeholder={"Ростов-на-Дону"}/>
                </div>
            </p>

            <p>
                <div className={styles.field_title}>Тип</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setType(e.target.value)} placeholder={"Университет"}/>
                </div>
            </p>

            <p>
                <button className={styles.nextButton} onClick={next}>Далее</button>
            </p>
        </>
    )
}