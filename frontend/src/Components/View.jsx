import CalendarComponent from "./CalendarComponent";
//import {Typography} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment/moment";
import SwipebleViewTile from "./SwipebleViewTile/SwipebleViewTile";

//const stats_url = "http://localhost:5000/stats"
const stats_url = "https://schedule.darksecrets.ru/api/stats/"

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

const dayOfWeek = [];

export default function View() {
    const navigate = useNavigate();
    const { groupId } = useParams();
    //const id = 44464

    const [groupChache, setGroupChache] = useState([])
    const [rasp, setRasp] = useState([]);
    const [info, setInfo] = useState({});
    const [groupedRasp, setGroupedRasp] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [isSendStats, setIsSendStats] = useState(false);

    const [date, setDate] = useState(new Date());
    const todayDate = date.getDate();
    const [inFavorites, setInFavorites] = useState(false);

    const normalize = (value) => {
        if (value < 10) return "0" + value;
        else return value;
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

    const updateSchedule = (currentDate) => {
        setIsLoaded(false);
        const curr_date = getDateString(currentDate)
        let isExists = false
        let existsIndex = 0
        Object.keys(groupChache).map((gr) => {
            if(Object.keys(groupChache[gr])[0]===curr_date) {
                isExists = true
                existsIndex = gr
            }
        })


        if (isExists) {
            setGroupedRasp(groupChache[existsIndex][`${curr_date}`][`${groupId}`]);
            setIsLoaded(true);
        } else {
            axios
            .get(
                "https://edu.donstu.ru/api/Rasp?idGroup=" +
                    groupId +
                    `&sdate=${curr_date}`
            )
            .then((res) => {
                setRasp(res.data.data.rasp);
                setInfo(res.data.data.info);

                let obj = scheduleProccessing(res);
                setGroupedRasp(obj);
                if (groupChache.length>0)
                    setGroupChache([...groupChache, {[`${curr_date}`]: {[`${groupId}`]:obj}}])
                else
                    setGroupChache([{[`${curr_date}`]: {[`${groupId}`]:obj}}])
                
                setIsLoaded(true);
                
            });
        }
    };

    const checkFavorites = () => {
        setInFavorites(false);
        const favoritesGroups = JSON.parse(localStorage.getItem("favorites"));
        // console.log(info);
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
        let convertedFavorites = []
        if (favoritesGroups) {
            favoritesGroups.forEach((favorites) => {
                convertedFavorites.push(favorites.name)
            })
        }
        
        axios.
            post(stats_url, {
                sg: JSON.parse(localStorage.getItem("searchList")),
                fav: convertedFavorites
            })

        const sended_date = new Date()
        console.log("sended")
        localStorage.setItem("send_data", sended_date)
        //setIsSendStats(true)
        //localStorage.setItem("is_sended", "1")
    }

    useEffect(() => {
        axios
            .get("https://edu.donstu.ru/api/GetRaspDates?idGroup=" + groupId)
            .then((res) => {
                const data = res.data.data.dates;
            });

        updateSchedule(new Date());
    }, []);

    let array = [];

    useEffect(() => {
        const doc = document.getElementById(todayDate);

        document.title = info.group?.name + " - Расписание MySecrets";
        checkFavorites();

        if (doc) doc.scrollIntoView({ behavior: "smooth", block: "start" });

        const sended_date = new Date(localStorage.getItem("send_data"))
        if (sended_date.getDate()!=date.getDate()) sendStats()
    }, [isLoaded === true]);

    const setFavorites = () => {
        let favoritesGroups = JSON.parse(
            localStorage.getItem("favorites")
        );

        if (inFavorites) {
            if (favoritesGroups.length > 0) {
                let myArray = favoritesGroups.filter(
                    function (obj) {
                        return obj.id !== info.group.groupID
                    }
                )
                localStorage.setItem("favorites", JSON.stringify(myArray))
            }
        } else {
            if (favoritesGroups === null)
                favoritesGroups = [];

            favoritesGroups.push({
                name: info.group.name,
                id: info.group.groupID,
                facul: "",
            })
            
            localStorage.removeItem("favorites");
            localStorage.setItem(
                "favorites",
                JSON.stringify(favoritesGroups)
            )
        }

        checkFavorites();
    }

    return (
        <div className="main-container">
            <div className="tiles-container">
                <header>
                    <div style={{ padding: "0 1.5em" }}></div>
                    <h2 className="title-h2">
                        Группа {isLoaded && info.group.name}
                    </h2>

                    {isLoaded && (
                        <div className={"icon-btn" + (inFavorites ? " favorite" : "")} onClick={() => setFavorites()}>
                            <svg
                                width="800px"
                                height="800px"
                                viewBox="-5.5 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="m0 2.089v21.912l6.546-6.26 6.545 6.26v-21.912c-.012-1.156-.952-2.089-2.109-2.089-.026 0-.051 0-.077.001h.004-8.726c-.022-.001-.047-.001-.073-.001-1.158 0-2.098.933-2.109 2.088v.001z" />
                            </svg>
                        </div>
                    )}
                </header>
                <CalendarComponent updateSchedule={updateSchedule} />
                
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
                                        {groupedRasp[gr].map((subjects) => (
                                            <SwipebleViewTile subjects={subjects}/>
                                        ))}
                                    </div>
                                ))}
                            </>
                        ) : (
                            <h3>На данную неделю нет расписания</h3>
                        )}
                    </>
                ) : (
                    <h2>Загрузка</h2>
                )}
            </div>
        </div>
    );
}
