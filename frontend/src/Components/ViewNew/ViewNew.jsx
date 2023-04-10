import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroups} from "../../asyncActions/groups";
import {useParams} from "react-router-dom";
import dayjs from "dayjs";
import {getMondayOfWeek, getWeek} from "../../utils/groupHelpers";
import SwipebleViewTile from "../SwipebleViewTile/SwipebleViewTile";
import styles from "./view-new.module.scss"
import cn from "classnames";

const weekDays = {
    0: "воскресенье",
    1: "понедельник",
    2: "вторник",
    3: "среда",
    4: "четверг",
    5: "пятница",
    6: "суббота",
}

const month = [
    "Января",
    "Февраля",
    "Марта",
    "Апреля",
    "Мая",
    "Июня",
    "Июля",
    "Августа",
    "Сентября",
    "Октября",
    "Ноября",
    "Декабря",
];

function isExists (group, groupId, date) {
    if (group.id === Number(groupId)) {
        const date1 = dayjs(group.date)
        const date2 = dayjs(date)
        if (date1.isSame(date2)) {
            return true
        }
    }

    return false
}

const ViewNew = () => {

    const containerRef = useRef(null);
    const [centeredElement, setCenteredElement] = useState(null);

    const {groupId} = useParams();
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.groups)
    const [todayDate, setTodayDate] = useState(null)
    const [currentSked, setCurrentSked] = useState({})

    const isGroupExists = (groupId, date) => {
        const _date = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DD')
        const group = groups.find(group => isExists(group, groupId, _date))
        if (group) return true
        return false
    }

    const getIfNotExist = (date) => {
        const isExists = isGroupExists(groupId, date)
        if (!isExists) {
            console.log("dispatch")
            dispatch(fetchGroups(groupId, date))
        }
        else {
            const mondayString = getMondayOfWeek(date)
            setTodayDate(mondayString)
            updateSchedule()
        }
    }

    useEffect(() => {
        let mondayString = null
        if (!todayDate) {
            mondayString = getMondayOfWeek()
            console.log(mondayString)
            setTodayDate(mondayString)
        } else {
            mondayString = getMondayOfWeek(todayDate)
        }


        const week = getWeek(mondayString)
        console.log(week)
        setCurrentSked({sked: week})

        document.getElementById('root').classList.remove('scroll-blocked')

        getIfNotExist(mondayString)
    }, [])

    const updateSchedule = () => {
        if (todayDate) {
            const mondayString = getMondayOfWeek(todayDate)
            const week = getWeek(mondayString)
            const group = groups.find(group => group.id === Number(groupId) && group.date === mondayString)
            let sked = {}
            Object.assign(sked, week)
            console.log(group)
            console.log(todayDate)
            if (group) {
                Object.keys(group.sked).map(date => sked[date] = group.sked[date])
                setCurrentSked({
                    id: group.id,
                    name: group.name,
                    date: group.date,
                    sked
                })
            }

            console.log(group)
        }

    }

    useEffect(() => {

        updateSchedule()
        const day = dayjs().day()
        console.log(day)

    }, [groups])

    const getNext = () => {
        console.log(todayDate)
        const currentDate = dayjs(todayDate).startOf('week').add(1, 'week')
        const dateString = currentDate.startOf('week').format('YYYY-MM-DD')
        console.log(dateString)
        setTodayDate(dateString)
        getIfNotExist(dateString)
    }

    const getPrev = () => {
        console.log(todayDate)
        const currentDate = dayjs(todayDate).add(-1, 'week')
        const dateString = currentDate.format('YYYY-MM-DD')
        console.log(dateString)
        setTodayDate(dateString)
        getIfNotExist(dateString)
    }

    return (
        <div className={styles.container}>
            {groups.length > 0 ?
                <div className={styles.view_scroll} ref={containerRef}>
                    {currentSked && Object.keys(currentSked).length > 0 ? (
                        <>
                            {Object.keys(currentSked.sked).map((date, index) => (
                                <div className={styles.day} id={Number(date.split("-")[2])} key={date}>
                                    {index === 8 &&
                                        <p>Переход на другую неделю</p>
                                    }
                                    {index === 0 &&
                                        <p>Переход на другую неделю</p>
                                    }
                                    <h2 className={cn(styles.day_title, date === todayDate && styles.today)}>
                                        {Number(date.split("-")[2])}{" "}
                                        {month[Number(date.split("-")[1]) - 1]}{" "}
                                        {date.split("-")[2] === todayDate.toString() && " (сегодня)"}
                                    </h2>
                                    <h5 className={styles.subtitle}>{weekDays[new Date(date).getDay()]}</h5>
                                    {currentSked.sked[date].length > 0 ?
                                        <>
                                            {currentSked.sked[date].map((subjects) => (
                                                <SwipebleViewTile isGroup={false} subjects={subjects}/>
                                            ))}
                                        </>
                                        :
                                        <div>
                                            <h3>Пар нет :)</h3>
                                            <button onClick={() => {
                                                if (index === 0) getPrev()
                                                if (index === 8) getNext()
                                            }
                                            }>
                                                {index === 0 && "Получить расписание предыдущей недели"}
                                                {index === 8 && "Получить расписание следующей недели"}
                                            </button>
                                        </div>
                                    }

                                </div>
                                // <div id={Number(gr.split("-")[2]).toString()}>
                                //     <h2 className={gr.split("-")[2] === todayDate ? "today" : "day"}>
                                //         {Number(gr.split("-")[2])}{" "}
                                //         {month[Number(gr.split("-")[1]) - 1]}{" "}
                                //         {gr.split("-")[2] === todayDate.toString() && " (сегодня)"}
                                //     </h2>
                                //     <h5>{weekDays[new Date(gr).getDay()]}</h5>
                                //     {currentSked.sked][gr].map((subjects) => (
                                //         <SwipebleViewTile isGroup={false} subjects={subjects}/>
                                //     ))}
                                // </div>
                            ))}
                        </>
                    ) : (
                        <h3>На данную неделю нет расписания</h3>
                    )}
                </div>
                :
                <div>Пусто</div>
            }
        </div>
    )
}

export default ViewNew