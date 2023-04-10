import React, {useState} from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

function Calendar2() {
    dayjs.locale('en'); // set locale

    const [currentMonth, setCurrentMonth] = useState(dayjs());

    const firstDayOfMonth = currentMonth.startOf('month').startOf('week').add(1, 'day');
    const lastDayOfMonth = currentMonth.endOf('month').endOf('week').subtract(1, 'day');
    const daysOfMonth = Array.from({ length: lastDayOfMonth.diff(firstDayOfMonth, 'day') + 1 }, (_, i) =>
        firstDayOfMonth.add(i, 'day')
    );
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const previousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
    };

    const nextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
    };

    const lastWeekStartsInNextMonth = lastDayOfMonth.month() !== currentMonth.month();

    const getWeekNumber = (date) => {
        const firstDayOfYear = date.startOf('year').startOf('week').add(1, 'day');
        const weekNumber = date.diff(firstDayOfYear, 'week');
        return weekNumber + 1;
    };

    return (
        <div>
            <div>
                <button onClick={previousMonth}>Previous Month</button>
                {currentMonth.format('MMMM YYYY')}
                <button onClick={nextMonth}>Next Month</button>
            </div>
            <table>
                <thead>
                <tr>
                    {daysOfWeek.map((day) => (
                        <th key={day}>{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {daysOfMonth.reduce((rows, day, i) => {
                    if (i % 7 === 0) rows.push([]);
                    rows[rows.length - 1].push(day);
                    return rows;
                }, []).slice(0, 4).map((week) => (
                    <tr key={week[0].format('YYYY-MM-DD')}>
                        {week.map((day) => (
                            <td key={day.format('YYYY-MM-DD')}>
                                {day.format('D')}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Calendar2;
