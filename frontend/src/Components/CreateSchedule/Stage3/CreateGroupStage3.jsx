import styles from "../create-schedule.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import {setStage1Action, setStage3Action} from "../../../store/createScheduleReducer";
import {useDispatch, useSelector} from "react-redux";

export const CreateGroupStage3 = ({_next}) => {
    const [name, setName] = useState('')
    const [level, setLevel] = useState(1)
    const [faculty, setFaculty] = useState('')
    const [groups, setGroups] = useState([])

    const dispatch = useDispatch()
    const stage = useSelector(state => state.createSchedule)

    const next = () => {
        axios.post(URLS.ACADEMIC_GROUPS, {
            name,
            level,
            faculty,
            university: stage.stage1._id
        }).then(res => {
            dispatch(setStage3Action(res.data.group))
            _next()
        })
    }

    useEffect(() => {
        axios.get(URLS.ACADEMIC_GROUPS + 'code/' + stage.stage1.code).then(res => {
            let obj = []
            if (Array.isArray(res.data)) {
                res.data.map(el => obj.push(el))
            }
            setGroups(obj)
        })
    }, [])

    useEffect(() => {
        console.log(groups)
    }, [groups])

    return (
        <>
            <p>
                <span>Теперь создайте свою группу</span>
            </p>

            <div>
                {Array.isArray(groups) && groups.map(gr =>
                    <div className={styles.groups}
                    onClick={() => {
                        dispatch(setStage3Action(gr))
                        _next()
                    }}
                    >
                        <div>{gr.name}</div>
                        <div>{gr.faculty}</div>
                    </div>
                )}
            </div>

            <p>
                <div className={styles.field_title}>Название</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder={"МКИС12"}/>
                </div>
            </p>
            <p>
                <div className={styles.field_title}>Курс</div>
                <div className={styles.field_container}>
                    <input onChange={(e) => setLevel(e.target.value)} value={level} type={'number'} placeholder={"Курс"}/>
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