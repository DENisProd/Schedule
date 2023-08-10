import styles from "../create-schedule.module.scss";
import {useState} from "react";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import {setStage1Action, setStage3Action} from "../../../store/createScheduleReducer";
import {useDispatch, useSelector} from "react-redux";

export const CreateGroupStage3 = ({_next}) => {
    const [name, setName] = useState('')
    const [level, setLevel] = useState(1)
    const [faculty, setFaculty] = useState('')

    const dispatch = useDispatch()
    const stage = useSelector(state => state.createSchedule)

    const next = () => {
        axios.post(URLS.ACADEMIC_GROUPS, {
            name,
            level,
            faculty,
            university: stage.stage1._id
        }).then(res => {
            dispatch(setStage3Action(res.data))
            _next()
        })
    }

    return (
        <>
            <p>
                <span>Теперь создайте свою группу</span>
            </p>

            <p>
                <div className={styles.field_title}>Название</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder={"МКИС12"}/>
                </div>
            </p>
            <p>
                <div className={styles.field_title}>Курс</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setLevel(e.target.value)} value={level} type={'number'} placeholder={"МКИС12"}/>
                </div>
            </p>
            <p>
                <div className={styles.field_title}>Факультет</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setFaculty(e.target.value)} value={faculty} placeholder={"ЭиНГП"}/>
                </div>
            </p>

            <p>
                <button className={styles.nextButton} onClick={next}>Далее</button>
            </p>
        </>
    )
}