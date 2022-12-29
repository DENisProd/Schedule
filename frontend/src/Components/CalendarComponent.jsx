//import {Calendar} from "antd";
//import {Typography} from "antd";
import {useEffect, useState} from "react";
import "../App.css"

//const { Title } = Typography

export default function CalendarComponent({updateSchedule}) {

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [currWeek, setCurrWeek] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date())

    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
        setCalendarVisible(false)
    }

    const showCalendar = () => {
        //setCalendarVisible(true)
    }

    const onSelect = () => {
        setCalendarVisible(false)
    }

    const getCurrentWeek = (date) => {
        let curr = getMonday(date)
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
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    useEffect(() => {
        setCurrWeek(getCurrentWeek(currentDate))
    }, [])

    return (
        <div className="calendar-main-container">
            <button onClick={() => {
                let newDate = currentDate
                newDate.setDate(newDate.getDate() - 7)
                setCurrWeek(getCurrentWeek(newDate))

                updateSchedule(currentDate)
            }}>{"<"}</button>
            {!calendarVisible &&
                <>
                    <MiniCalendar currentWeek={currWeek}/>
                    {/*<h1 onClick={showCalendar} level={5}>27 апреля</h1>*/}
                </>
            }
            <button onClick={() => {
                let newDate = currentDate
                newDate.setDate(newDate.getDate() + 7)
                setCurrWeek(getCurrentWeek(newDate))

                updateSchedule(currentDate)
            }}>{">"}</button>

            {/*{calendarVisible &&*/}
            {/*    <Calendar fullscreen={false} onSelect={onSelect} onPanelChange={onPanelChange} />*/}
            {/*}*/}

        </div>
    )
}

const weekDays = [
    'пн',
    'вт',
    'ср',
    'чт',
    'пт',
    'сб',
    'вс'
]

function MiniCalendar(props) {
    return (
        <div className="mini-calendar-container">
            {props.currentWeek.map((day, index) =>
                <div className="mini-calendar-item" key={index}>
                    <h1>{day.split('-')[2]}</h1>
                    <h4>{weekDays[index]}</h4>
                </div>
            )}


        </div>
    )
}