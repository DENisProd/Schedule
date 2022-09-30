import {Calendar} from "antd";
import {Typography} from "antd";
import {useEffect, useState} from "react";

const { Title } = Typography

export default function CalendarComponent(props) {

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [currWeek, setCurrWeek] = useState([])

    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
        setCalendarVisible(false)
    }

    const showCalendar = () => {
        setCalendarVisible(true)
    }

    const onSelect = () => {
        setCalendarVisible(false)
    }

    useEffect(() => {
        setCurrWeek(props.currentWeek)
    }, [])

    return (
        <div>
            {!calendarVisible &&
                <>
                    <MiniCalendar currentWeek={currWeek}/>
                    <Title onClick={showCalendar} level={5}>27 апреля</Title>
                </>
            }


            {calendarVisible &&
                <Calendar fullscreen={false} onSelect={onSelect} onPanelChange={onPanelChange} />
            }

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