import {useEffect, useState} from "react";
import moment from 'moment';
import "./calendar.css"

const Calendar = () => {
    // const GetRows7 = () => {
    //     const today = moment();
    //     const currentMonth = today.month()+2;
    //     const currentYear = today.year();
    //     const daysInMonth = moment(`${currentYear}-${currentMonth + 1}`, "YYYY-MM").daysInMonth();
    //     let firstDayOfMonth = moment(`${currentYear}-${currentMonth + 1}-01`, "YYYY-MM-DD").day() - 1;
    //
    //     const calendarRows = [];
    //     let calendarCells = [];
    //
    //     if (firstDayOfMonth === -1) {
    //         firstDayOfMonth = 6;
    //     }
    //     // Add empty cells for the days before the first day of the month
    //     for (let i = 0; i < firstDayOfMonth; i++) {
    //         calendarCells.push(<td key={`empty-${i}`}></td>);
    //     }
    //
    //     // Add cells for the days of the month
    //     for (let i = 1; i <= daysInMonth; i++) {
    //         calendarCells.push(<td key={`day-${i}`}>{i}</td>);
    //         if ((firstDayOfMonth + i) % 7 === 0) {
    //             calendarRows.push(<tr key={`week-${i}`}>{calendarCells}</tr>);
    //             calendarCells = [];
    //         }
    //     }
    //
    //     // Add empty cells for the days after the last day of the month
    //     if (calendarCells.length > 0) {
    //         for (let i = calendarCells.length; i < 7; i++) {
    //             calendarCells.push(<td key={`empty-${i}`}></td>);
    //         }
    //         calendarRows.push(<tr key={`week-${daysInMonth + 1}`}>{calendarCells}</tr>);
    //     }
    //     return calendarRows
    // }

    const [currentMonth, setCurrentMonth] = useState(moment().month());
    const [currentYear, setCurrentYear] = useState(moment().year());
    const [currentDate, setCurrentDate] = useState(moment());

    useEffect(() => {
        setCurrentDate(moment(`${currentYear}-${currentMonth + 1}-01`, "YYYY-MM-DD"));
    }, [currentYear, currentMonth]);

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextYear = () => {
        setCurrentYear(currentYear + 1);
    };

    const handlePreviousYear = () => {
        setCurrentYear(currentYear - 1);
    };

    const daysInMonth = currentDate.daysInMonth();
    let firstDayOfMonth = currentDate.day() - 1;

    const calendarRows = [];
    let calendarCells = [];

    // Add empty cells for the days before the first day of the month
    if (firstDayOfMonth === -1) {
        firstDayOfMonth = 6;
    }
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarCells.push(<td key={`empty-${i}`}></td>);
    }

    // Add cells for the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarCells.push(<td key={`day-${i}`}>{i}</td>);
        if ((firstDayOfMonth + i) % 7 === 0) {
            calendarRows.push(<tr key={`week-${i}`}>{calendarCells}</tr>);
            calendarCells = [];
        }
    }

    // Add empty cells for the days after the last day of the month
    if (calendarCells.length > 0) {
        for (let i = calendarCells.length; i < 7; i++) {
            calendarCells.push(<td key={`empty-${i}`}></td>);
        }
        calendarRows.push(<tr key={`week-${daysInMonth + 1}`}>{calendarCells}</tr>);
    }

    return (
        <div className="european-calendar">
            <div className="european-calendar-header">
                <button className="previous-year-button" onClick={handlePreviousYear}>Previous Year</button>
                <button className="previous-month-button" onClick={handlePreviousMonth}>Previous Month</button>
                <h2 className="current-month-label">{currentDate.format("MMMM YYYY")}</h2>
                <button className="next-month-button" onClick={handleNextMonth}>Next Month</button>
                <button className="next-year-button" onClick={handleNextYear}>Next Year</button>
            </div>
            <table className="european-calendar-table">
                <thead>
                <tr>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                </tr>
                </thead>
                <tbody>{calendarRows}</tbody>
            </table>
        </div>
    );
}

export default Calendar