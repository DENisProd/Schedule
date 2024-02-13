import styles from "../create-schedule.module.scss";
import {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import {setStage1Action, setStage3Action} from "../../../store/createScheduleReducer";
import {useDispatch, useSelector} from "react-redux";

export const CreateGroupStage3 = ({_next, back}) => {
    const [name, setName] = useState(null)
    const [level, setLevel] = useState(1)
    const [faculty, setFaculty] = useState(null)
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

            {Array.isArray(groups) && groups.length > 0 &&
                <p>
                    <span>Или выберите существующие группы для вашего учебного заведения, которые открыли для общего доступа</span>
                </p>
            }

            <div className={styles.groups_list}>
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

            <div className={styles.button_container}>
                <button className={styles.nextButton} disabled={!(name && faculty && level > 0)} onClick={next}>Далее</button>
            </div>
        </>
    )
}