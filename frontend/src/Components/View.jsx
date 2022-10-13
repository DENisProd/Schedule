import CalendarComponent from "./CalendarComponent";
import {Typography} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import moment from "moment/moment";

const {Title} = Typography

const types = [
    { name: "лаб", color: "#E4E9FF" },
    { name: "лек", color: "#DBFFE7" },
    { name: "пр.", color: "#FFE2E7" },
    { name: "фв", color: "#FFF8E1" }
]

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
    "Декабря"
]

const dayOfWeek = []

export default function View() {

    const navigate = useNavigate()
    const { groupId } = useParams()
    //const id = 44464

    const [rasp, setRasp] = useState([])
    const [info, setInfo] = useState({})
    const [groupedRasp, setGroupedRasp] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)

    const date = new Date()
    const todayDate = date.getDate()

    const normalize = (value) => {
        if (value < 10) return "0" + value
        else return value
    }

    const getCurrentWeek = () => {
        let curr = new Date
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i +1
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
        }
        return week
    }

    const getCurrentWeek2 = () => {
        let curr = getMonday(new Date())
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
        }
        return week
    }

    const getMonday = (d) => {
        d = new Date(d);
        let day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    const getNextWeek = () => {
        let date = new Date(),
            targetDay = 1, // пятница, начиная с вс=0
            targetDate = new Date(),
            delta = targetDay - date.getDay();
        if (delta >= 0) {targetDate.setDate(date.getDate() + delta)}
        else {targetDate.setDate(date.getDate() + 7 + delta)}

    }

    const getStyle = (name) => {
        for (let i = 0; i < types.length; i++)
            if (name.split(" ")[0].includes(types[i].name))
                return types[i].color
        return ""
    }

    useEffect(() => {
        localStorage.setItem("groupId", groupId)

        axios.get("https://edu.donstu.ru/api/GetRaspDates?idGroup=" + groupId).then(res => {
            console.log(res.data)
            const data = res.data.data.dates

        })

        axios.get("https://edu.donstu.ru/api/Rasp?idGroup=" + groupId +
            `&sdate=${date.getFullYear()}-${normalize(date.getMonth() + 1)}-${normalize(date.getDate())}`).then(res => {
            setRasp(res.data.data.rasp)
            setInfo(res.data.data.info)

            let obj = {}
            let rasp1 = res.data.data.rasp
            for (let i = 0; i < rasp1.length; i++) {
                if (obj[rasp1[i]['дата'].split('T')[0]]?.length > 0) {
                    if (rasp1[i]['номерЗанятия'] === rasp1[i-1]['номерЗанятия'] && rasp1[i-1]['дата'].split('T')[0] === rasp1[i]['дата'].split('T')[0]) {
                        obj[rasp1[i]['дата'].split('T')[0]].push({...rasp1[i], isPodgr: true})
                    } else {
                        obj[rasp1[i]['дата'].split('T')[0]].push({...rasp1[i], isPodgr: false})
                    }
                } else {
                    obj[rasp1[i]['дата'].split('T')[0]] = []
                    obj[rasp1[i]['дата'].split('T')[0]].push({...rasp1[i], isPodgr: false})
                }
            }

            setGroupedRasp(obj)
            setIsLoaded(true)
        })

    }, [])

    useEffect(() => {
        const doc = document.getElementById(todayDate)

        console.log(getCurrentWeek2())
        document.title = info.group?.name + " - Расписание MySecrets"

        if (doc)
            doc.scrollIntoView( { behavior: 'smooth', block: 'start' } );
    }, [isLoaded===true])

    return (
        <div className="main-container">
            <button className="btn-back" onClick={() => {
                localStorage.removeItem("groupId")
                navigate("/")
            }}>Назад к поиску</button>
            {isLoaded ?
                <div className="tiles-container">
                    <h2 className="title-h2">Группа {info.group.name}</h2>
                    <CalendarComponent currentWeek={getCurrentWeek2()}/>
                    {Object.keys(groupedRasp).map(gr =>
                        <div id={Number(gr.split('-')[2]).toString()}>
                            <h2 className={gr.split('-')[2]===todayDate.toString() ? "today" : ""}>{Number(gr.split('-')[2])} {month[Number(gr.split('-')[1])-1]} {gr.split('-')[2]===todayDate.toString() && " (сегодня)"}</h2>
                            {groupedRasp[gr].map(subject =>
                                <div className="subject-tile" key={subject['код']}>
                                    <div className="subject-tile-left" style={{background: subject.isPodgr ? 'none' : getStyle(subject['дисциплина'])}}>
                                        {!subject.isPodgr &&
                                            <>
                                                <h1>{subject['номерЗанятия']}</h1>
                                                <h4>с {subject['начало']}</h4>
                                                <h4>до {subject['конец']}</h4>
                                            </>}

                                    </div>

                                    <div className="subject-tile-right">
                                        <h3>{subject['дисциплина']}</h3>
                                        <p><b>{subject?.isPodgr && "Подгруппа"}</b></p>
                                        {/*<p>Код {subject['код']}</p>*/}
                                        {/*<p>Дата начала {subject['дата'].split('T')[0]}</p>*/}

                                        <p>Аудитория {subject['аудитория']}</p>
                                        {/*<p>День недели {subject['день_недели']}</p>*/}
                                        {/*<p>День недели2 {subject['деньНедели']}</p>*/}
                                        <p>{subject['преподаватель']}</p>
                                    </div>


                                </div>
                            )}
                        </div>
                    )}
                </div>
                :
                <h1>Загрузка</h1>}

        </div>
    )
}