import {useState} from "react";
import {CreateUniversityStage1} from "./Stage1/CreateUniversityStage1";
import {CreateTimeSchedule} from "./Stage2/CreateTimeSchedule";

import styles from './create-schedule.module.scss'
import {PrologStage0} from "./Stage0/PrologStage0";
import {useDispatch, useSelector} from "react-redux";
import {CreateGroupStage3} from "./Stage3/CreateGroupStage3";
import {CreateScheduleStage4} from "./Stage4/CreateScheduleStage4";

export const CreateSchedule = () => {
    const [stage, setStage] = useState(0)

    const next = () => setStage(prevState => prevState+1)

    return (
        <div className={styles.container}>
            <h2>Создание расписания</h2>
            {stage === 0 && <PrologStage0 setStage={setStage}/>}
            {stage === 1 && <CreateUniversityStage1 _next={next}/>}
            {stage === 2 && <CreateTimeSchedule _next={next}/>}
            {stage === 3 && <CreateGroupStage3 _next={next}/>}
            {stage === 4 && <CreateScheduleStage4 _next={next}/>}
        </div>
    )
}