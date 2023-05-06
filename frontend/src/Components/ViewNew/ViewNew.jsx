import {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroups} from "../../asyncActions/groups";
import {useParams} from "react-router-dom";
import dayjs from "dayjs";
import {getMondayOfWeek, getWeek} from "../../utils/groupHelpers";
import SwipebleViewTile from "../SwipebleViewTile/SwipebleViewTile";
import styles from "./view-new.module.scss"
import cn from "classnames";
import {getInfo} from "../../utils/getInfo";
import ViewHeaderNew from "./ViewHeaderNew/ViewHeaderNew";
import {month, weekDays} from "../../utils/dateUtils";
import {SettingsContext} from "../../providers/SettingsProvider";
import {sendStats} from "../../utils/sendStats";

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

const ViewNew = ({addToCompare}) => {

    const containerRef = useRef(null);

    const dataFetch = useRef(false)

    const {groupId} = useParams();
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.groups)
    const [todayDate, setTodayDate] = useState(null)
    const [currentSked, setCurrentSked] = useState({})
    const [lookAt, setLookAt] = useState([])
    const [currentWeek, setCurrentWeek] = useState([])
    // const [isTouchEnd, setIsTouchEnd] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState(null)
    const {settings, setSettings} = useContext(SettingsContext)

    const currentDateString = dayjs().format('YYYY-MM-DD')

    const isGroupExists = (groupId, date) => {
        const _date = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DD')
        const group = groups.find(group => isExists(group, groupId, _date))
        return !!group;
    }

    const dayWatcher = () => {
        let sunday = currentWeek[0] // trigger to get prev week
        let monday = currentWeek[8] // trigger to get next week
        let days = currentWeek.slice(1,8)
        const targets = currentWeek.map(date => document.getElementById(date))
        const thresholds = 0.9
        const callback = (entries, observer) => {

            entries.map(entry => {
                if (entry.intersectionRatio > thresholds) {
                        setLookAt(entry.target.id)
                }
            })
        }
        const options = {
            root: document.querySelector('#scrollArea'),
            threshold: thresholds
        }
        const observer = new IntersectionObserver(callback, options);

        if (targets) {
            targets.map(tar => {
                if (tar) observer.observe(tar)
            })
        }
    }

    const getIfNotExist = (date) => {
        const isExists = isGroupExists(groupId, date)
        if (!isExists) {
            // console.log("dispatch")
            dispatch(fetchGroups(groupId, date))
        }
        else {
            const mondayString = getMondayOfWeek(date)
            setTodayDate(mondayString)
            // updateSchedule()

        }
    }

    useEffect(() => {
        if (dataFetch.current)
            return
        getInfo()
        setIsLoading(true)
        let mondayString
        if (!todayDate) {
            mondayString = getMondayOfWeek()
            // console.log(mondayString)
            setTodayDate(mondayString)
        } else {
            mondayString = getMondayOfWeek(todayDate)
        }


        const week = getWeek(mondayString)
        // console.log(week)
        setCurrentSked({sked: week})

        document.getElementById('root').classList.remove('scroll-blocked')

        getIfNotExist(mondayString)


        let count_enter = Number.parseInt(localStorage.getItem("count_enter"))
        if (count_enter) count_enter++
        else count_enter = 1
        localStorage.setItem("count_enter", count_enter.toString())

        sendStats()


        dataFetch.current = true
    }, [])

    useEffect(() => {
        if (todayDate) {
            const mondayString = getMondayOfWeek(todayDate)
            const week = getWeek(mondayString)


            const group = groups.find(group => group.id === Number(groupId) && group.date === mondayString)
            let sked = {}
            Object.assign(sked, week)
            setCurrentWeek(Object.keys(week))

            if (group) {
                Object.keys(group.sked).map(date => sked[date] = group.sked[date])
                setCurrentSked({
                    id: group.id,
                    name: group.name,
                    date: group.date,
                    sked
                })
            }
            setIsLoading(false)
            // addScrollLimit()
            scrollToStart()
            // TODO добавление первой группы в группу пользователя по умолчанию
        }
    }, [todayDate, groups])

    const getNext = () => {
        setIsLoading(true)
        const currentDate = dayjs(todayDate).startOf('week').add(1, 'week')
        const dateString = currentDate.startOf('week').format('YYYY-MM-DD')
        setTodayDate(dateString)
        getIfNotExist(dateString)
        setMode('next')
    }

    const getPrev = () => {
        setIsLoading(true)
        const currentDate = dayjs(todayDate).add(-1, 'week')
        const dateString = currentDate.format('YYYY-MM-DD')
        setTodayDate(dateString)
        getIfNotExist(dateString)
        setMode('prev')
    }

    useEffect(() => {
        const sunday = currentWeek[0]
        const monday = currentWeek[8]
        // if (lookAt === sunday && !isLoading) getPrev()
        // if (lookAt === monday && !isLoading) getNext()
        scrollToStart()
    }, [lookAt])

    useEffect(() => {
        if (!isLoading)
            dayWatcher()
            scrollTo(currentDateString)

    }, [currentWeek])

    const scrollToStart = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    // const addScrollLimit = () => {
    //     const element = document.getElementById('scrollArea')
    //     if (element) {
    //         element.addEventListener('scroll', () => {
    //             const maxScroll = element.scrollWidth - element.clientWidth;
    //             // console.log(element.scrollLeft)
    //             console.log(element.clientWidth)
    //             if (element.scrollLeft > maxScroll) {
    //                 element.scrollLeft = maxScroll;
    //             }
    //         });
    //     }
    //
    // }

    const scrollTo = (to) => {
        // if (doc) doc.scrollIntoView({behavior: "smooth", block: "start"});
        let doc = null
        if (mode === 'prev')
            doc = document.getElementById(currentWeek[6])
        else if (mode === 'next')
            doc = document.getElementById(currentWeek[0])
        else
            doc = document.getElementById(to)

        setMode(null)
        if (doc) doc.scrollIntoView(true);
    }

    return (
        <div className={styles.container}>
            <ViewHeaderNew week={currentWeek} info={currentSked} prev={getPrev} next={getNext} lookAt={lookAt} scrollTo={scrollTo} addToCompare={addToCompare}/>
            {groups.length > 0 ?
                <div className={cn(styles.view_scroll, settings?.calDir === "top" && styles.top)} ref={containerRef} id={"scrollArea"}
                     // onTouchEnd={() => setIsTouchEnd(true)}
                     // onTouchStart={() => setIsTouchEnd(false)}
                     // onMouseDown={() => setIsTouchEnd(false)}
                     // onMouseUp={() => setIsTouchEnd(true)}
                >
                    {currentSked && Object.keys(currentSked).length > 0 ? (
                        <>
                            {Object.keys(currentSked.sked).map((date, index) => (

                                <div className={styles.day} id={date} key={date}>
                                    {/*{index === 8 &&*/}
                                    {/*    <p>Переход на другую неделю</p>*/}
                                    {/*}*/}
                                    {/*{index === 0 &&*/}
                                    {/*    <p>Переход на другую неделю</p>*/}
                                    {/*}*/}
                                    <h2 className={cn(styles.day_title, date === currentDateString && styles.today)}>
                                        {Number(date.split("-")[2])}{" "}
                                        {month[Number(date.split("-")[1]) - 1]}{" "}
                                        {date === currentDateString && " (сегодня)"}
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
                                            {/*<button onClick={() => {*/}
                                            {/*    if (index === 0) getPrev()*/}
                                            {/*    if (index === 8) getNext()*/}
                                            {/*}*/}
                                            {/*}>*/}
                                            {/*    {index === 0 && "Получить расписание предыдущей недели"}*/}
                                            {/*    {index === 8 && "Получить расписание следующей недели"}*/}
                                            {/*</button>*/}
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