import {ScheduleTileStage4Create} from "./ScheduleTileStage4";
import styles from "../create-schedule.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useState} from "react";

export const SubjectTileStage4 = ({ subject }) => {
    return (
        <div className={styles.stage4tile}>
            <div>{subject?.name}</div>
            <div style={{
                display: 'flex',
                justifyContent:'space-between'
            }}>
                <div>Аудитория {subject?.audName}</div>
                <div>{subject?.timeStart}-{subject?.endTime}</div>
            </div>
            
            <div>{subject?.teacherName}</div>
        </div>
    )
}