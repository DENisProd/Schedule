import styles from '../tasks.module.scss'
import {useState} from "react";
import TaskCreate from "../TaskCreate/TaskCreate";

export const TasksBottom = ({tagsList}) => {
    const [isCreating, setIsCreating] = useState(false)

    return (
        <>
            {isCreating ?
                <div className={styles.dark_background}>
                    <div className={styles.bottom_container}>
                        <TaskCreate setIsCreating={setIsCreating} tagsList={tagsList}/>
                    </div>
                </div>
                :
                <button onClick={() => setIsCreating(true)} className={styles.add_btn}>+</button>
            }
        </>
    )
}