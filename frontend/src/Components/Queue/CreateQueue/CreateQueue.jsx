import styles from '../queue.module.scss'
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import dayjs from "dayjs";

export const CreateQueue = () => {
    const { subjectId } = useParams();
    const [error, setError] = useState('')
    const [subjectData, setSubjectData] = useState(null)

    const [dateTime, setDateTime] = useState('')
    const [formattedDateTime, setFormattedDateTime] = useState(null)

    const handleDateTimeChange = (event) => {
        const inputDateTime = event.target.value
        setDateTime(inputDateTime)

        const formatted = dayjs(inputDateTime).toDate()
        setFormattedDateTime(formatted)
    }

    useEffect(() => {
        axios.get(URLS.SUBJECT + subjectId).then(r => {
            if (!r.data.isError) setError(r.data.message)
            setSubjectData(r.data)
        })
    }, [subjectId])

    const create = () => {
        const data = {
            subjectId,
            groupId: subjectData?.group._id,
            userUid: localStorage.getItem('clientId'),
            startTime: formattedDateTime,
        }
        axios.post(URLS.QUEUE, data).then(res => {
            console.log(res)
        })
    }

    return (
        <div className={styles.create_container}>
            <div className={styles.title_container}><h2>Создание очереди</h2> <button>?</button></div>

            {subjectData ?
                <div className={styles.inner_container}>
                    <p><b>Группа:</b> {subjectData?.group?.name}</p>
                    <p><b>Предмет:</b> {subjectData?.name}</p>
                    <p><b>Преподаватель:</b> {subjectData?.teacherName}</p>
                    <p><b>Дата:</b> {dayjs(subjectData?.date).format('DD.MM.YYYY')}</p>
                    <p><b>{"  Время: "}</b>{subjectData?.startTime}{" - "}{subjectData?.endTime}</p>
                    <div>
                        <p>Дата и время начала записи в очередь</p>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={handleDateTimeChange}
                        />
                    </div>
                </div>
            :
                <div>Предмет не найден</div>
            }
            <p>{error}</p>
            <button onClick={create}>Создать очередь</button>
        </div>
    )
}