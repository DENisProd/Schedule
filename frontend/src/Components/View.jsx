import CalendarComponent from "./CalendarComponent";
//import {Typography} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment/moment";
import SwipebleViewTile from "./SwipebleViewTile/SwipebleViewTile";
import Loader from "./Loader/Loader";

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

export default function View({isTeachers, isRoom, isGroup}) {
    const {groupId} = useParams();

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

    const normalize = (value) => {
        if (value < 10) return "0" + value;
        else return value;
    };

    const getRequestUrl = () => {
        let url = "";

        if (isTeachers) url = requests.teachers;
        if (isRoom) url = requests.room;
        if (isGroup) url = requests.group;

        return url;
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
                    console.log("fetched")
                    let obj = scheduleProccessing(res);
                    setGroupedRasp(obj);
                    if (groupChache.length > 0)
                        setGroupChache([...groupChache, {[`${curr_date}`]: {[`${groupId}`]: obj}}])
                    else
                        setGroupChache([{[`${curr_date}`]: {[`${groupId}`]: obj}}])


                    setIsLoaded(true);

                })
                .catch(err => {
                    console.log("Ошибка")
                    setTimeout(() => {
                        setAttempt(attempt + 1)
                        console.log(attempt)
                        if (attempt < 3) {
                            updateSchedule(currDate)
                            return
                        } else {
                            setIsError(false)
                            return
                        }

                    }, 1000);

                })
        }
    };

    const checkFavorites = () => {
        setInFavorites(false);
        const favoritesGroups = JSON.parse(localStorage.getItem("favorites"));
        if (favoritesGroups) {
            favoritesGroups.forEach((favorites) => {
                if (favorites.id === info?.group?.groupID) {
                    setInFavorites(true);
                    return;
                }
            });
        }
    };

    const sendStats = () => {
        const favoritesGroups = JSON.parse(localStorage.getItem("favorites"));
        const enterCounts = Number.parseInt(localStorage.getItem("count_enter"))

        let convertedFavorites = []
        if (favoritesGroups) {
            favoritesGroups.forEach((favorites) => {
                convertedFavorites.push(favorites.name)
            })
        }

        axios.post(stats_url, {
            sg: JSON.parse(localStorage.getItem("searchList")),
            fav: convertedFavorites,
            count: enterCounts / 2
        })

        const sended_date = new Date()
        localStorage.setItem("send_data", sended_date)
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

                setGroupedRasp(cache)
                setInfo(infoCache)
                setIsLoaded(true)
                console.log("cache")
            }
        }

        updateSchedule(currentDate);
    }, []);

    const normalizeThresholds = (threshold) => {
        const th = 1 / (threshold.length)
        return th > 1 ? 1 : th
    }

    useEffect(() => {

        document.title = info.group?.name + " - Расписание MySecrets";
        checkFavorites();
        scrollTo(todayDate)
        let count_enter = Number.parseInt(localStorage.getItem("count_enter"))
        if (count_enter) count_enter++
        else count_enter = 1
        localStorage.setItem("count_enter", count_enter)

        const sended_date = new Date(localStorage.getItem("send_data"))
        if (sended_date.getDate() !== date.getDate()) sendStats()
        if (isGroup) {
            localStorage.setItem("cache", JSON.stringify(groupedRasp))
            localStorage.setItem("infoCache", JSON.stringify(info))
        }
    }, [isLoaded === true]);

    useEffect(() => {
        setLookAt([])
        if (groupedRasp) {

            const targets = Object.keys(groupedRasp).map(gr => document.getElementById(new Date(gr).getDate()))
            const thresholds = Object.keys(groupedRasp).map(gr => normalizeThresholds(groupedRasp[gr]))
            const callback = (entries, observer) => {

                entries.map(entry => {
                    setLookAt([])
                    if (entry.intersectionRatio > 0.1) {
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
        <div className="main-container">
            <div className="tiles-container">
                <ViewHeader isGroup={isGroup} isTeachers={isTeachers} isRoom={isRoom} isLoaded={isLoaded}
                            inFavorites={inFavorites} checkFavorites={checkFavorites} group={info}/>
                <CalendarComponent currentDate={currentDate} updateSchedule={updateSchedule} groupedRasp={groupedRasp}
                                   scrollTo={scrollTo} lookAt={lookAt}/>

                <div className="tiles-main-container" id={"scrollArea"}>
                    {isError ?
                        <>
                            {isLoaded ? (
                                <>
                                    {Object.keys(groupedRasp).length > 0 ? (
                                        <>
                                            {Object.keys(groupedRasp).map((gr) => (
                                                <div id={Number(gr.split("-")[2]).toString()}>
                                                    <h2 className={gr.split("-")[2] === todayDate.toString() ? "today" : "day"}>
                                                        {Number(gr.split("-")[2])}{" "}
                                                        {month[Number(gr.split("-")[1]) - 1]}{" "}
                                                        {gr.split("-")[2] === todayDate.toString() && " (сегодня)"}
                                                    </h2>
                                                    <h5>{weekDays[new Date(gr).getDay()]}</h5>
                                                    {groupedRasp[gr].map((subjects) => (
                                                        <SwipebleViewTile isGroup={isGroup} subjects={subjects}/>
                                                    ))}
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <h3>На данную неделю нет расписания</h3>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Loader/>
                                </>
                            )}
                        </>
                        :
                        <>
                            <h3>Ошибка сети :( перезагрузите страницу или включите интернет</h3>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

function ViewHeader(props) {

    const addToFavorites = () => {
        let favoritesGroups = JSON.parse(
            localStorage.getItem("favorites")
        );

        if (props.inFavorites) {
            if (favoritesGroups.length > 0) {
                let myArray = favoritesGroups.filter(
                    function (obj) {
                        return (obj.id !== props.group.groupID);
                    });
                localStorage.setItem("favorites", JSON.stringify(myArray));
            }
        } else {
            if (favoritesGroups === null) favoritesGroups = [];
            favoritesGroups.push({
                name: props.group.name,
                id: props.group.groupID,
                facul: "",
            });
            localStorage.removeItem("favorites");
            localStorage.setItem("favorites", JSON.stringify(favoritesGroups));
        }

        props.checkFavorites();
    }

    return (
        <header>
            <div style={{padding: "0 1.5em"}}></div>
            {props.isRoom && <h2 className="title-h2">Аудитория {props.isLoaded && props.group.aud.name}</h2>}
            {props.isTeachers &&
                <h2 className="title-h2">Преподаватель {props.isLoaded && props.group.prepod.name}</h2>}
            {props.isGroup && <h2 className="title-h2">Группа {props.isLoaded && props.group.group.name}</h2>}


            {(props.isLoaded && props.isGroup) && (
                <div
                    className={"icon-btn" + (props.inFavorites ? " favorite" : "")}
                    onClick={addToFavorites}>
                    <svg width="800px" height="800px" viewBox="-5.5 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m0 2.089v21.912l6.546-6.26 6.545 6.26v-21.912c-.012-1.156-.952-2.089-2.109-2.089-.026 0-.051 0-.077.001h.004-8.726c-.022-.001-.047-.001-.073-.001-1.158 0-2.098.933-2.109 2.088v.001z"/>
                    </svg>
                </div>
            )}
        </header>
    )
}
