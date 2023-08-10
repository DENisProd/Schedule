import {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroups} from "../../asyncActions/groups";
import {useParams, useSearchParams} from "react-router-dom";
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
import SmileSVG from "../../assets/SmileSVG";
import Loader2 from "../Loader/Loader2";
import ErrorBoundary from "../../utils/ErrorBoundary";

import Art1 from '../../assets/arts/Art1.svg'
import Art2 from '../../assets/arts/Art2.svg'
import Art3 from '../../assets/arts/Art3.svg'
import Art4 from '../../assets/arts/Art4.svg'

function isExists (group, groupId, date, univer) {
    if (univer === 'dstu') {
        if (Number(group.id) === Number(groupId)) {
            const date1 = dayjs(group.date)
            const date2 = dayjs(date)
            if (date1.isSame(date2)) {
                return true
            }
        }
    } else {
        if (group.id === groupId) {
            const date1 = dayjs(group.date)
            const date2 = dayjs(date)
            if (date1.isSame(date2)) {
                return true
            }
        }
    }


    return false
}

const arts = [
    Art1,
    Art2,
    Art3,
    Art4
]

const ViewNew = ({isTeachers, isRoom, isGroup, isMobile, addToCompare}) => {

    const randomIndex = Math.floor(Math.random() * arts.length);
    const art = arts[randomIndex];

    const containerRef = useRef(null);

    const dataFetch = useRef(false)

    const {groupId} = useParams();
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.groups)
    const [searchParams, setSearchParams] = useSearchParams();
    const [todayDate, setTodayDate] = useState(null)
    const [currentSked, setCurrentSked] = useState({})
    const [lookAt, setLookAt] = useState([])
    const [currentWeek, setCurrentWeek] = useState([])
    // const [isTouchEnd, setIsTouchEnd] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState(null)
    const {settings, setSettings} = useContext(SettingsContext)
    const [university, setUniversity] = useState(searchParams.get('u'))

    const currentDateString = dayjs().format('YYYY-MM-DD')

    const isGroupExists = (groupId, date, univer) => {
        const _date = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DD')
        const group = groups.find(group => isExists(group, groupId, _date, univer))
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

    const getIfNotExist = (date, univer) => {
        const isExists = isGroupExists(groupId, date, univer)
        if (!isExists) {
            dispatch(fetchGroups(groupId, date, univer))
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

        let univer = searchParams.get('u')
        if (univer === "undefined") univer = 'dstu'
        const week = getWeek(mondayString)

        setCurrentSked({sked: week})

        document.getElementById('root').classList.remove('scroll-blocked')

        getIfNotExist(mondayString, univer)


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

            const group = groups.find(group => {
                return group.id === groupId && group.date === mondayString
            })
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
        let univer = searchParams.get('u')
        if (!univer) univer = 'dstu'
        getIfNotExist(dateString, univer)
        setMode('next')
    }

    const getPrev = () => {
        setIsLoading(true)
        const currentDate = dayjs(todayDate).add(-1, 'week')
        const dateString = currentDate.format('YYYY-MM-DD')
        setTodayDate(dateString)
        let univer = searchParams.get('u')
        getIfNotExist(dateString, univer)
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
        <ErrorBoundary>
            <div className={styles.container}>
                {settings?.calDir === "top" && <ViewHeaderNew university={university} week={currentWeek} info={currentSked} prev={getPrev}
                                next={getNext} lookAt={lookAt} scrollTo={scrollTo} addToCompare={addToCompare}/>}
                {groups.length > 0 && currentSked.sked && !isLoading ?
                    <div className={cn(styles.view_scroll, settings?.calDir === "top" && styles.top, !isMobile && styles.desktop)} ref={containerRef} id={"scrollArea"}
                        // onTouchEnd={() => setIsTouchEnd(true)}
                        // onTouchStart={() => setIsTouchEnd(false)}
                        // onMouseDown={() => setIsTouchEnd(false)}
                        // onMouseUp={() => setIsTouchEnd(true)}
                    >
                        {!isMobile &&
                            <>
                                {/*<div className={styles.right}/>*/}
                                {/*<div className={styles.left}/>*/}
                            </>
                        }
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
                                        {/*<h5 className={styles.subtitle}>{weekDays[new Date(date).getDay()]}</h5>*/}
                                        {currentSked.sked[date].length > 0 ?
                                            <>
                                                {currentSked.sked[date].map((subjects) => (
                                                    <SwipebleViewTile isGroup={isGroup} subjects={subjects}/>
                                                ))}
                                            </>
                                            :
                                            <div>

                                                <div className={styles.art}>
                                                    <img src={art}/>
                                                </div>
                                                <h3 style={{
                                                    userSelect: 'none'
                                                }}>Пар нет</h3>
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
                                ))}
                            </>
                        ) : (
                            <h3>На данную неделю нет расписания</h3>
                        )}
                    </div>
                    :
                    <div className={styles.view_scroll}>
                        <div style={{margin: '8rem auto 0 auto',}}>
                            <Loader2/>
                        </div>
                    </div>
                }
                {settings?.calDir !== "top" && <ViewHeaderNew university={university} week={currentWeek} info={currentSked} prev={getPrev}
                                                              next={getNext} lookAt={lookAt} scrollTo={scrollTo} addToCompare={addToCompare}/>}
            </div>
        </ErrorBoundary>
    )
}

export default ViewNew