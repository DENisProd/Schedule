// DateAndTimePicker.js
import React, { useState } from 'react';
import styles from "./tasks.module.scss";

const DateAndTimePicker = ({ setParentValue}) => {
    // Состояния для хранения значения даты и времени
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Обработчики изменения значений даты и времени
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        setParentValue && setParentValue({
            date: event.target.value,
            start: startTime,
            end: endTime
        })
    };

    const handleStartTimeChange = (event) => {
        setStartTime(event.target.value);
        setParentValue && setParentValue({
            date: selectedDate,
            start: event.target.value,
            end: endTime
        })
    };

    const handleEndTimeChange = (event) => {
        setEndTime(event.target.value);
        setParentValue && setParentValue({
            date: selectedDate,
            start: startTime,
            end: event.target.value
        })
    };

    return (
        <div className={styles.time_select}>
            <p>
                <label htmlFor="date">Дата: </label>
                <input type="date" id="date" name="date" value={selectedDate} onChange={handleDateChange} />
            </p>
            <p>
                <label htmlFor="time">Время начала: </label>
                <input type="time" id="time1" name="time" value={startTime} onChange={handleStartTimeChange} />
            </p>
            <p>
                <label htmlFor="time">Время окончания: </label>
                <input type="time" id="time2" name="time" value={endTime} onChange={handleEndTimeChange} />
            </p>
        </div>
    );
};

export default DateAndTimePicker;