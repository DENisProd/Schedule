import React, {useState} from "react";
import {CreateUniversityStage1} from "./Stage1/CreateUniversityStage1";
import {CreateTimeSchedule} from "./Stage2/CreateTimeSchedule";

import styles from './create-schedule.module.scss'
import {PrologStage0} from "./Stage0/PrologStage0";
import {useDispatch, useSelector} from "react-redux";
import {CreateGroupStage3} from "./Stage3/CreateGroupStage3";
import {CreateScheduleStage4} from "./Stage4/CreateScheduleStage4";
import {useNavigate} from "react-router-dom";

export const CreateSchedule = () => {
    const navigate = useNavigate()
    const [stage, setStage] = useState(0)

    const next = () => setStage(prevState => prevState+1)
    const back = () => {
        if (stage - 1 < 0) navigate('/test/')
        else setStage(prevState => prevState-1)
    }

    return (
        <div className={styles.container}>
            <div className={styles.create_title}>
                <button onClick={back}>
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18L3 10M3 10L10 2M3 10H37.5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                </button>
                <h2>Создание расписания</h2>
            </div>
            {stage === 0 && <PrologStage0 setStage={setStage}/>}
            {stage === 1 && <CreateUniversityStage1 _next={next}/>}
            {stage === 2 && <CreateTimeSchedule _next={next} back={back}/>}
            {stage === 3 && <CreateGroupStage3 _next={next} back={back}/>}
            {stage === 4 && <CreateScheduleStage4 _next={next} back={back}/>}
        </div>
    )
}