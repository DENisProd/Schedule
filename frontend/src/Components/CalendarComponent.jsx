//import {Calendar} from "antd";
//import {Typography} from "antd";
import {useEffect, useState} from "react";
import "../App.css"

//const { Title } = Typography

export default function CalendarComponent({currentDate, updateSchedule, groupedRasp, scrollTo, lookAt}) {

    const [calendarVisible, setCalendarVisible] = useState(false)
    const [currWeek, setCurrWeek] = useState([])
    //const [currentDate, setCurrentDate] = useState(new Date())

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
        week.push(new Date(curr.setDate(curr.getDate())).toISOString().slice(0, 10))
        for (let i = 1; i <= 6; i++) {
            let day = new Date(curr.setDate(curr.getDate()+1)).toISOString().slice(0, 10)
            week.push(day)
        }
        return week
    }

    const getMonday = (d) => {
        //d = new Date(d);
        d = currentDate
        let day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    useEffect(() => {
        setCurrWeek(getCurrentWeek(currentDate))
        //checkDate()
    }, [])

    return (
        <div className="calendar-main-container">
            <button onClick={() => {
                let newDate = currentDate
                newDate.setDate(newDate.getDate() - 7)
                setCurrWeek(getCurrentWeek(newDate))

                updateSchedule(currentDate, true)
            }}>{"<"}</button>
            {!calendarVisible &&
                <>
                    <MiniCalendar currentWeek={currWeek} groupedRasp={groupedRasp} scrollTo={scrollTo} lookAt={lookAt}/>
                    {/*<h1 onClick={showCalendar} level={5}>27 апреля</h1>*/}
                </>
            }
            <button onClick={() => {
                let newDate = currentDate
                newDate.setDate(newDate.getDate() + 7)
                setCurrWeek(getCurrentWeek(newDate))

                updateSchedule(currentDate, true)
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
    const [classes, setClasses] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    const checkExists = () => {
        let ab = JSON.parse(JSON.stringify(props.currentWeek))
        setClasses(ab)
        Object.keys(props.groupedRasp).map(date => {
            //if (ab.includes(date)) console.log("yes")
            ab[ab.indexOf(date)] = "exists"
        })
        setClasses(ab)
        setIsLoaded(true)
    }

    useEffect(() => {
        checkExists()
    }, [])

    useEffect(() => {
        checkExists()
    }, [props.groupedRasp])

    return (
        <div className="mini-calendar-container">
            {isLoaded &&
                <>
                    {props.currentWeek.map((day, index) =>
                        <div className={`mini-calendar-item ${classes[index]==="exists" ? "exists" : ""} ${props.lookAt.includes(day.split('-')[2]) ? "active" : ""}`} key={index} onClick={() => props.scrollTo(new Date(day).getDate())}>
                            <h1>{day.split('-')[2]}</h1>
                            <h4>{weekDays[index]}</h4>
                        </div>
                    )}
                </>
            }
        </div>
    )
}