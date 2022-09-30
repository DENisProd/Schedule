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

export default function View() {

    const navigate = useNavigate()
    const { groupId } = useParams()
    //const id = 44464

    const [rasp, setRasp] = useState([])
    const [info, setInfo] = useState({})
    const [groupedRasp, setGroupedRasp] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)

    const normalize = (value) => {
        if (value < 10) return "0" + value
        else return value
    }

    const getCurrentWeek = () => {
        let curr = new Date
        let week = []

        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
        }
        return week
    }

    const getStyle = (name) => {
        for (let i = 0; i < types.length; i++)
            if (name.split(" ")[0].includes(types[i].name))
                return types[i].color
        return ""
    }

    useEffect(() => {
        axios.get("https://edu.donstu.ru/api/GetRaspDates?idGroup=" + groupId).then(res => {
            console.log(res.data)
            const data = res.data.data.dates

        })

        let date = new Date()

        axios.get("https://edu.donstu.ru/api/Rasp?idGroup=" + groupId +
            `&sdate=${date.getFullYear()}-${normalize(date.getMonth() + 1)}-${normalize(date.getDate())}`).then(res => {
            setRasp(res.data.data.rasp)
            setInfo(res.data.data.info)
            console.log(res.data.data.info)

            let obj = {}
            res.data.data.rasp.map(sub => {
                if (obj[sub['дата'].split('T')[0]]?.length > 0) {
                    obj[sub['дата'].split('T')[0]].push(sub)

                } else {
                    obj[sub['дата'].split('T')[0]] = []
                    obj[sub['дата'].split('T')[0]].push(sub)
                }
            })
            setGroupedRasp(obj)
            setIsLoaded(true)
        })


    }, [])

    useEffect(() => {

    }, [rasp])

    return (
        <div className="main-container">
            <button onClick={() => navigate("/")}>Назад к поиску</button>
            {isLoaded ?
                <>
                    <Title level={2}>Группа {info.group.name}</Title>
                    <CalendarComponent currentWeek={getCurrentWeek()}/>
                    {Object.keys(groupedRasp).map(gr =>
                        <div>
                            <h2>{Number(gr.split('-')[2])} {month[Number(gr.split('-')[1])-1]}</h2>
                            {groupedRasp[gr].map(subject =>
                                <div className="subject-tile" key={subject['код']}>
                                    <div className="subject-tile-left" style={{background: getStyle(subject['дисциплина'])}}>
                                        <h1>{subject['номерЗанятия']}</h1>
                                        <h4>с {subject['начало']}</h4>
                                        <h4>до {subject['конец']}</h4>
                                    </div>

                                    <div className="subject-tile-right">
                                        <h3>{subject['дисциплина']}</h3>
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
                </>
                :
                <h1>Загрузка</h1>}

        </div>
    )
}