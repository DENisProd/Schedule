import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import cn from 'classnames'
import styles from './message.module.scss'
import {removeMessageAction} from "../../store/messageReducer";
import axios from "axios";
import {URLS} from "../../utils/urlsUtils";

export const Message = () => {
    const dispatch = useDispatch()
    const messages = useSelector(state => state.messages.messages)
    const [isVisible, setIsVisible] = useState(false)

    const [currentMessage, setCurrentMessage] = useState({})

    useEffect(() => {
        if (Array.isArray(messages) && messages.length > 0) {
            const message = messages[0]
            setCurrentMessage(message)
            setIsVisible(true)
            const data = {
                url: window.location.href,
                favorites: localStorage.getItem('favorites2'),
                myGroup: localStorage.getItem('my-group2'),
                groupId: localStorage.getItem('groupId2'),
                message
            }
            axios.post(URLS.ERRORS_LOG, data).then(res => console.log(res))
        }
    }, [messages])

    const close = (message) => {
        dispatch(removeMessageAction(message.id))
        setCurrentMessage({})
        setIsVisible(false)
    }

    return (
        <div className={cn(styles.container, isVisible && styles.visible)}>
            <div className={cn(styles.message, isVisible && styles.visible)}>
                <h3>{currentMessage.text}</h3>
                {/*<p>{currentMessage.when}</p>*/}
                <button onClick={() => close(currentMessage)}>Закрыть</button>
            </div>
        </div>
    )
}