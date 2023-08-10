import {ScheduleTileStage4Create} from "./ScheduleTileStage4";
import styles from "../create-schedule.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {useCallback, useState} from "react";

export const SubjectTileStage4 = ({ subject }) => {
    return (
        <div className={styles.stage4tile}>
            <p>{subject?.name}</p>
            <p>{subject?.audName}</p>
            <p>{subject?.teacherName}</p>
            <p>{subject?.timeStart}-{subject?.endTime}</p>
        </div>
    )
}