import {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";

import styles from './my-queues.module.scss'
import {useNavigate} from "react-router-dom";

const MyQueues = () => {
    const [queueList, setQueueList] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const myGroup = JSON.parse(localStorage.getItem('my-group2'))
        if (myGroup) axios.get(URLS.QUEUE + 'group/'+myGroup.id).then(res => setQueueList(res.data))
    }, [])

    return (
        <div className={styles.container}>
            <header>
                <button onClick={() => navigate('/main/')}>{'<-'} Назад</button>
                <h1>Мои очереди</h1>
            </header>

            <main>
                {Array.isArray(queueList) && queueList.map(queue =>
                    <div className={styles.queue_tile} onClick={() => navigate('/queue/'+queue._id)}>
                        <h5>Предмет: { queue?.subject?.name}</h5>
                        <h5>Группа: <span className={styles.secondary}>{ queue?.group?.name}</span></h5>
                        <h5>Участников: { queue?.members.length}</h5>
                        <h5>Начало записи: { queue?.startTime}</h5>
                        <h5>Автор: <span className={styles.secondary}>{ queue.author}</span></h5>
                    </div>
                )}
            </main>
        </div>
    )
}

export default MyQueues