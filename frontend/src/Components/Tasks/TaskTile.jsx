import cn from "classnames";
import styles from "./tasks.module.scss";
import {deleteTodo, TASK_STATUSES, toggleTodo} from "../../store/todoReducer";
import {useEffect, useState} from "react";

import CloseIcon from '../../assets/close_icon.svg'
import {useDispatch} from "react-redux";

const statuses = [
    TASK_STATUSES.TO_DO,
    TASK_STATUSES.IN_PROGRESS,
    TASK_STATUSES.COMPLETED
]

export function TaskTile({todo}) {
    const dispatch = useDispatch()
    const [statusIndex, setStatusIndex] = useState(0)
    const [style, setStyle] = useState(null)

    const handleToggleTodo = (id, status) => {
        dispatch(toggleTodo({id, status}))
    }

    const handleDeleteTodo = (id) => {
        dispatch(deleteTodo(id))
    }

    useEffect(() => {
        setStyle(getStyle)
    }, [todo?.status])

    const getStyle = () => {
        let style = null
        if (todo.status === TASK_STATUSES.COMPLETED) {
            style = styles.completed
            setStatusIndex(2)
        }
        else if (todo.status === TASK_STATUSES.IN_PROGRESS) {
            style = styles.in_progress
            setStatusIndex(1)
        }
        else {
            style = styles.to_do
            setStatusIndex(0)
        }

        return style
    }

    const _toggleTodo = () => {
        if (statusIndex >= 0 && statusIndex < statuses.length) {
            handleToggleTodo(todo.id, statuses[statusIndex+1])
            setStatusIndex(prevState => prevState++)
        }
    }

    return (
        <div
            className={cn(styles.todo_item)}
            key={todo.id}
        >

            {/*{todo.photo && (*/}
            {/*    <img*/}
            {/*        src={todo.photo}*/}
            {/*        alt="Task"*/}
            {/*        className={styles.todo_photo}*/}
            {/*    />*/}
            {/*)}*/}

            <svg onClick={_toggleTodo} className={cn(styles.todo_checkbox, style)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill="none" stroke="#007895" strokeWidth="2"/>
                <path d="M7 11.5L10.7128 14.8002C11.1408 15.1807 11.8002 15.1247 12.158 14.6775L17.5 8" stroke="#007895" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className={styles.todo_text}>
                <div>{todo?.text}</div>
                <div className={styles.description}>{todo?.description}</div>
            </span>
            <div>
                <button
                    className={styles.delete_button}
                    onClick={() => handleDeleteTodo(todo.id)}
                >
                    <img src={CloseIcon}/>
                </button>
            </div>
        </div>
    )
}