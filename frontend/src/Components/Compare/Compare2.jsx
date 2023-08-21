import React, {useEffect, useRef, useState} from 'react';
import VerticalTable from "./VerticalTable/VerticalTable";
import {getMondayOfWeek, getWeek} from "../../utils/groupHelpers";

import styles from "./compare.module.scss"
import axios from "axios";
import {URLS} from "../../utils/urlsUtils";
import {useSelector} from "react-redux";
import CompareCalendar from "./CompareCalendar/CompareCalendar";
import dayjs from "dayjs";

import Guide from '../../assets/compare.gif'

const Compare2 = ({compareList, groupsLis2t}) => {

    const dataFetch = useRef(false)

    const [sked, setSked] = useState({})
    const [data, setData] = useState(null)
    const date = {name: '1 мая', id: '2023-05-01T00:00:00.000Z'}

    const [todayDate, setTodayDate] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState(null)

    const groupsList = useSelector(state => state.compare)

    const fetchData = (mondayString) => {
        if (groupsList.groupsc.length > 0) {
            axios.post(URLS.COMPARE + '?date=' + mondayString, {groups: groupsList.groupsc}).then(r => setData(r.data))
            // axios.post(URLS.COMPARE+'?date='+date.id.split('T')[0], {groups: groupsList.groupsc}).then(r => setData(r.data))
        }
    }

    useEffect(() => {
        document.getElementById('root').classList.remove('scroll-blocked')

        if (dataFetch.current)
            return
        let mondayString

        if (!todayDate) {
            mondayString = getMondayOfWeek()
            // console.log(mondayString)
            setTodayDate(mondayString)
        } else {
            mondayString = getMondayOfWeek(todayDate)
        }

        console.log(groupsList)
        fetchData(mondayString)

        dataFetch.current = true
    }, [])

    useEffect(() => {
        if (data) {
            console.log(data)
            let schedule = getWeek(todayDate)
            let groups = []
            data.map(group => groups.push(group.groupName))
            console.log('not error')
            let _day = {}

            Object.keys(_date => {
                groups.map(gr => {
                    for (let i = 1; i < 7; i++) {
                        _day[i] = {
                            1: {audName: ''},
                            2: {audName: ''},
                            3: {audName: ''},
                            4: {audName: ''},
                            5: {audName: ''},
                            6: {audName: ''},
                            7: {audName: ''}
                        }
                    }
                    schedule[_date][gr] = _day
                })
            })
            console.log(schedule)


            data.map(group => {

                //schedule[day.date.split('T')[0]][group.groupName] = _day
                console.log(group.days)
                group.days.map(day => {
                    let _day = {}
                    for (let i = 1; i < 7; i++) {
                        _day[i] = {}
                    }
                    console.log(_day)

                    day.subjects.map(subject => {
                        _day[subject.number] = subject
                    })

                    // if (day.groupName) {
                    if (day.groupName) {
                        const dateKey = day.date.split('T')[0];
                        if (!schedule[dateKey]) {
                            schedule[dateKey] = {};
                        }

                        if (!schedule[dateKey][day.groupName]) {
                            schedule[dateKey][day.groupName] = {};
                        }

                        schedule[dateKey][day.groupName] = _day;
                    }
                    // if (schedule[day.date.split('T')[0]][day?.groupName]) schedule[day.date.split('T')[0]][day?.groupName] = _day
                    else {
                        console.log(groups)
                        groups.map(gr => {
                            schedule[day.date.split('T')[0]][gr] = {}
                            for (let i = 1; i < 7; i++) {
                                schedule[day.date.split('T')[0]][gr][i] = {}
                            }
                        })
                        schedule[day.date.split('T')[0]][day.groupName] = _day
                    }
                })
            })
            console.log('not err2')
            setSked(schedule)
        }
    }, [data])

    const getNext = () => {
        setIsLoading(true)
        const currentDate = dayjs(todayDate).startOf('week').add(1, 'week')
        const dateString = currentDate.startOf('week').format('YYYY-MM-DD')
        setTodayDate(dateString)
        console.log('next')
        // TODO loading next week compare
        fetchData(dateString)

        setMode('next')
    }

    const getPrev = () => {
        setIsLoading(true)
        const currentDate = dayjs(todayDate).add(-1, 'week')
        const dateString = currentDate.format('YYYY-MM-DD')
        setTodayDate(dateString)
        console.log('prev')
        // TODO loading prev week compare
        fetchData(dateString)

        setMode('prev')
    }

    return (
        <div className={styles.container}>
            {/*<CompareCalendar todayDate={todayDate} prev={getPrev} next={getNext}/>*/}
            {sked && Object.keys(sked).map(date =>
                <VerticalTable schedule={sked[date]} date={date}/>
            )}
            {!data &&
                <>
                    <h2 style={{ fontSize: '14px' }}>Список групп для сравнения пуст</h2>
                    <p>Чтобы добавить группу в сравнение нажмите "+" рядом с названием группы</p>
                    <img src={Guide} style={{ height: '40vh', objectFit: 'cover'}}/>
                </>
            }
        </div>
    );
};

export default Compare2;