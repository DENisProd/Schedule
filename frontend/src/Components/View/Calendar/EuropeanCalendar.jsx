import React, {useState, useEffect} from "react";
import moment from "moment";
import styles from "./calendar.scss";
import cn from "classnames"

function EuropeanCalendar({_year, _month, darkMode}) {
    const [calendar, setCalendar] = useState([]);
    const [year, setYear] = useState(_year)
    const [month, setMonth] = useState(_year)

    useEffect(() => {
        const firstDayOfMonth = moment(`${year}-${month}-01`, "YYYY-MM-DD");
        const firstDayOfWeek = firstDayOfMonth.clone().startOf("isoWeek");
        const lastDayOfMonth = moment(firstDayOfMonth).endOf("month");
        const lastDayOfWeek = lastDayOfMonth.clone().endOf("isoWeek");
        const end = lastDayOfWeek.date();

        const rows = [];
        let days = [];
        let day = firstDayOfWeek;

        while (day <= lastDayOfMonth || days.length < 7) {
            if (days.length === 7) {
                rows.push(days);
                days = [];
            } else if (day < firstDayOfMonth || day > lastDayOfMonth) {
                days.push({
                    date: day.date(),
                    isCurrentMonth: false,
                });
            } else {
                days.push({
                    date: day.date(),
                    isCurrentMonth: true,
                });
                day.add(1, "day");
            }
        }

        if (days.length > 0) {
            while (days.length < 7) {
                if (day > lastDayOfMonth) {
                    days.push({
                        date: day.date(),
                        isCurrentMonth: false,
                    });
                    day.add(1, "day");
                } else {
                    days.push({
                        date: day.date(),
                        isCurrentMonth: true,
                    });
                    day.add(1, "day");
                }
            }
            rows.push(days);
        }

        setCalendar(rows);
    }, [year, month]);

    return (
        <div className={cn(styles.calendar, darkMode && styles.dark_mode)}>
            <div className={styles.header}>
                <button
                    className={cn(styles.btn, styles.prev_year)}
                    onClick={() => setYear(year - 1)}
                >
                    {"<"}
                </button>
                <button
                    className={cn(styles.btn, styles.prev_month)}
                    onClick={() => {
                        if (month === 1) {
                            setMonth(12);
                            setYear(year - 1);
                        } else {
                            setMonth(month - 1);
                        }
                    }}
                >
                    {"<"}
                </button>
                <div className={styles.label}>
                    {moment(`${year}-${month}-01`, "YYYY-MM-DD").format("MMMM YYYY")}
                </div>
                <button
                    className={cn(styles.btn, styles.next_month)}
                    onClick={() => {
                        if (month === 12) {
                            setMonth(1);
                            setYear(year + 1);
                        } else {
                            setMonth(month + 1);
                        }
                    }}
                >
                    {">"}
                </button>
                <button
                    className={cn(styles.btn, styles.next_year)}
                    onClick={() => setYear(year + 1)}
                >
                    {">"}
                </button>
            </div>
            <table className={styles.table}>
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
                <tbody>
                {calendar.map((week, index) => (
                    <tr key={index}>
                        {week.map((day, index) => (
                            <td
                                key={index}
                                className={cn(day.isCurrentMonth ? styles.current_month : styles.other_month)}
                            >
                                {day.date}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default EuropeanCalendar;