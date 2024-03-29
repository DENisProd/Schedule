import CalendarComponent from "./View/CalendarComponent";
import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useContext, useEffect, useState} from "react";

import axios from "axios";
import SwipebleViewTileOld from "./SwipebleViewTile/SwipebleViewTileOld";
import Loader from "./Loader/Loader";
import ViewHeader from "./View/ViewHeader";
import ViewHeaderTitle from "./View/ViewHeader";
import "./View/view-header.css"
import {SettingsContext} from "../providers/SettingsProvider";
import cn from "classnames";
import Calendar from "./View/Calendar/Calendar";
import EuropeanCalendar from "./View/Calendar/EuropeanCalendar";
import Calendar2 from "./View/Calendar/Calendar2";
import {groupByDate, groupByDateWithSubgroups, groupNew, groupSchedule} from "../utils/groupHelpers";
import {sendStats} from "../utils/sendStats";
import Loader2 from "./Loader/Loader2";

const currentVersion = 0.73

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

// https://edu.donstu.ru/api/EventsCalendar?eventID=undefined   календарь событий
// https://edu.donstu.ru/api/Feed?userID=-271626&startDate=null   лента

const weekDays = {
    0: "воскресенье",
    1: "понедельник",
    2: "вторник",
    3: "среда",
    4: "четверг",
    5: "пятница",
    6: "суббота",
}

const stats_url = "https://schedule.darksecrets.ru/api/stats/"

const requests = {
    group: "https://edu.donstu.ru/api/Rasp?idGroup=",
    room: "https://edu.donstu.ru/api/Rasp?idAudLine=",
    teachers: "https://edu.donstu.ru/api/Rasp?idTeacher=",
};

export default function View({isTeachers, isRoom, isGroup, addToCompare}) {
    const {groupId} = useParams();
    const navigate = useNavigate()

    const [info, setInfo] = useState({});
    const [groupedRasp, setGroupedRasp] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date())
    const [groupChache, setGroupChache] = useState([])

    const [date, setDate] = useState(new Date());
    const todayDate = date.getDate();
    const [inFavorites, setInFavorites] = useState(false);
    const [lookAt, setLookAt] = useState([])
    const [attempt, setAttempt] = useState(1)
    const [isError, setIsError] = useState(true)

    const {settings, setSettings} = useContext(SettingsContext)

    const normalize = (value) => {
        if (value < 10) return "0" + value
        else return value
    };

    const getRequestUrl = () => {
        let url = ""

        if (isTeachers) url = requests.teachers
        if (isRoom) url = requests.room
        if (isGroup) url = requests.group

        return url
    };

    const scheduleProccessing = (res) => {
        let obj = {};
        let rasp1 = res.data.data.rasp;
        for (let i = 0; i < rasp1.length; i++) {
            const raspDate = rasp1[i]["дата"].split("T");
            if (obj[raspDate[0]]?.length > 0) {
                if (
                    rasp1[i]["номерЗанятия"] === rasp1[i - 1]["номерЗанятия"] &&
                    rasp1[i - 1]["дата"].split("T")[0] === raspDate[0]
                ) {
                    obj[raspDate[0]][obj[raspDate[0]].length - 1].push({
                        ...rasp1[i],
                        isPodgr: true,
                    });
                } else {
                    obj[raspDate[0]].push([
                        {
                            ...rasp1[i],
                            isPodgr: false,
                        },
                    ]);
                }
            } else {
                obj[raspDate[0]] = [];
                obj[raspDate[0]].push([
                    {
                        ...rasp1[i],
                        isPodgr: false,
                    },
                ]);
            }
        }

        return obj;
    };

    const getDateString = (currentDate) => {
        return `${currentDate.getFullYear()}-${normalize(currentDate.getMonth() + 1)}-${normalize(currentDate.getDate())}`
    }

    // const checkFavorites = (_info = info) => {
    //     setInFavorites(false)
    //     const favoritesGroups = JSON.parse(localStorage.getItem("favorites"))
    //     if (favoritesGroups) {
    //         favoritesGroups.forEach((favorites) => {
    //             console.log(favorites)
    //             console.log(info)
    //             console.log(_info)
    //                 if (Number.parseInt(favorites.id) === Number.parseInt(_info.group.groupId)) {
    //                     setInFavorites(true)
    //                     console.log(inFavorites)
    //                     return
    //                 }
    //         })
    //     }
    // }

    const checkFavorites = (_info = info) => {
        setInFavorites(false);
        const favoritesGroups = JSON.parse(localStorage.getItem("favorites"));
        if (favoritesGroups) {
            favoritesGroups.forEach((favorites) => {
                if (favorites.id === _info?.group?.groupID) {
                    setInFavorites(true);
                    return;
                }
            });
        }
    };

    const updateSchedule = (currDate, isNext = false) => {
        if (isNext) setIsLoaded(false);

        let sdate = ""
        if (currDate.getDay() === 0) {
            let newDate = currDate
            newDate.setDate(newDate.getDate() + 1)
            setCurrentDate(newDate)
        }

        sdate = `${currentDate.getFullYear()}-${normalize(currentDate.getMonth() + 1)}-${normalize(currentDate.getDate())}`

        const curr_date = getDateString(currentDate)
        let isExists = false
        let existsIndex = 0

        Object.keys(groupChache).map((gr) => {
            if (Object.keys(groupChache[gr])[0] === curr_date) {
                isExists = true
                existsIndex = gr
            }
        })


        if (isExists) {
            setGroupedRasp(groupChache[existsIndex][`${curr_date}`][`${groupId}`]);
            setIsLoaded(true);
        } else {
            axios
                .get(getRequestUrl() + groupId + `&sdate=${sdate}`)
                .then((res) => {
                    // setRasp(res.data.data.rasp);
                    setInfo(res.data.data.info);
                    let obj = scheduleProccessing(res);
                    let test = groupSchedule(res.data)

                    try {
                        let objTest = groupByDateWithSubgroups(res.data)

                        setGroupedRasp(objTest.sked);
                    } catch (e) {
                        console.log(e)
                    }
                    // setGroupedRasp(obj);
                    if (groupChache.length > 0)
                        setGroupChache([...groupChache, {[`${curr_date}`]: {[`${groupId}`]: obj}}])
                    else
                        setGroupChache([{[`${curr_date}`]: {[`${groupId}`]: obj}}])
                    checkFavorites(res.data.data.info);
                    setIsLoaded(true);


                })
                .catch(err => {
                    console.log("Ошибка")
                    //console.log(err)
                    setTimeout(() => {
                        setAttempt(attempt + 1)

                        if (attempt < 3) {
                            //updateSchedule(currDate)
                            return
                        } else {
                            setIsError(true)
                            return
                        }

                    }, 1000);

                })
        }
    }

    useEffect(() => {
        // axios
        //     .get("https://edu.donstu.ru/api/GetRaspDates?idGroup=" + groupId)
        //     .then((res) => {
        //         const data = res.data.data.dates;
        //     });
        setIsLoaded(false)
        if (isGroup) {
            const cache = JSON.parse(localStorage.getItem("cache"))
            const infoCache = JSON.parse(localStorage.getItem("infoCache"))
            if (cache !== null && infoCache !== null && Object.keys(cache).length > 0 && Object.keys(infoCache).length > 0) {
                if (infoCache.group.groupID === groupId) {
                    setGroupedRasp(cache)
                    setInfo(infoCache)
                    setIsLoaded(true)
                    console.log("cache")
                }

            }
        }
        document.getElementById('root').classList.remove('scroll-blocked')
        updateSchedule(currentDate);
    }, []);

    const normalizeThresholds = (threshold) => {
        const th = 1 / (threshold.length)
        return th > 1 ? 1 : th
    }

    useEffect(() => {

        document.title = info.group?.name + " - Я Студент";
        //checkFavorites();
        scrollTo(todayDate)
        let count_enter = Number.parseInt(localStorage.getItem("count_enter"))
        if (count_enter) count_enter++
        else count_enter = 1
        localStorage.setItem("count_enter", count_enter.toString())

        sendStats()

        if (isGroup) {
            localStorage.setItem("cache", JSON.stringify(groupedRasp))
            localStorage.setItem("infoCache", JSON.stringify(info))
        }
        const usedVersion = localStorage.getItem("usedver")
        if (usedVersion && Number.parseInt(usedVersion)!==currentVersion) console.log("update!")
        else localStorage.setItem("usedver", currentVersion.toString())

    }, [isLoaded === true]);

    useEffect(() => {
        setLookAt([])
        if (groupedRasp) {

            const targets = Object.keys(groupedRasp).map(gr => document.getElementById(new Date(gr).getDate().toString()))
            const thresholds = Object.keys(groupedRasp).map(gr => normalizeThresholds(groupedRasp[gr]))
            const callback = (entries, observer) => {

                entries.map(entry => {
                    setLookAt([])
                    if (entry.intersectionRatio > 0.2) {
                        setLookAt(prev => [...prev, normalize(entry.target.id)])
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
    }, [groupedRasp, isLoaded === true])

    const scrollTo = (to) => {
        const doc = document.getElementById(to);
        // if (doc) doc.scrollIntoView({behavior: "smooth", block: "start"});
        if (doc) doc.scrollIntoView(true);
    }

    return (
        <div className={cn("main-container", settings?.calDir === "top" && "top")} id={"tiles-container"}>
            {/*<div className="tiles-container">*/}
            <ViewHeader currentDate={currentDate} updateSchedule={updateSchedule} groupedRasp={groupedRasp}
                        scrollTo={scrollTo} lookAt={lookAt} isGroup={isGroup} isTeachers={isTeachers} isRoom={isRoom} isLoaded={isLoaded}
                        inFavorites={inFavorites} checkFavorites={checkFavorites} group={info} addToCompare={addToCompare}/>

            {/*<Calendar2/>*/}
            <div id={"scrollArea"}>

                {/*<div className="tiles-main-container" id={"scrollArea"}>*/}
                    {isError ?
                        <>
                            {isLoaded ? (
                                <>
                                    {Object.keys(groupedRasp).length > 0 ? (
                                        <>
                                            {Object.keys(groupedRasp).map((gr) => (
                                                <div id={Number(gr.split("-")[2]).toString()} style={{minHeight: '20vh'}}>
                                                    <h2 className={gr.split("-")[2] === todayDate.toString() ? "today" : "day"}>
                                                        {Number(gr.split("-")[2])}{" "}
                                                        {month[Number(gr.split("-")[1]) - 1]}{" "}
                                                        {gr.split("-")[2] === todayDate.toString() && " (сегодня)"}
                                                    </h2>
                                                    <h5>{weekDays[new Date(gr).getDay()]}</h5>
                                                    {groupedRasp[gr].map((subjects) => (
                                                        <SwipebleViewTileOld isGroup={isGroup} subjects={subjects}/>
                                                    ))}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <h3>На данную неделю нет расписания</h3>
                                    )}
                                </>
                            ) : (
                                <div style={{marginTop: '10rem'}}>
                                    <Loader2/>
                                </div>
                            )}
                        </>
                        :
                        <>
                            <h3>Ошибка сети :( перезагрузите страницу или включите интернет</h3>
                        </>
                    }
                </div>
            {/*</div>*/}
        </div>
    );
}
