import React, {useEffect, useState} from 'react';
import VerticalTable from "./VerticalTable/VerticalTable";
import {getWeek} from "../../utils/groupHelpers";

import styles from "./compare.module.scss"
import axios from "axios";
import {URLS} from "../../utils/urlsUtils";

const Compare2 = ({compareList, groupsList} ) => {
    const [sked, setSked] = useState({})
    const [data, setData] = useState(null)
    const date = {name: '22 мая', id: '2023-05-23T00:00:00.000Z'}
    useEffect(() => {
        document.getElementById('root').classList.remove('scroll-blocked')

        if (groupsList.length > 0) {
            axios.post(URLS.COMPARE, {groups: groupsList}).then(r => setData(r.data))
        }
    }, [])

    useEffect(() => {
        console.log(data)
        let schedule = getWeek(data[0].mondayDate)
        let groups = []
        data.map(group => groups.push(group.groupName))
        let _day = {}

        Object.keys(_date => {
            groups.map(gr => {
                for (let i = 1; i < 7; i++) {
                    _day[i] = {}
                }
                schedule[_date][gr] = _day
            })
        })
        console.log(schedule)

        data.map(group => {

            //schedule[day.date.split('T')[0]][group.groupName] = _day
            group.days.map(day => {
                let _day = {}
                for (let i = 1; i < 7; i++) {
                    _day[i] = {}
                }
                console.log(_day)

                day.subjects.map(subject => {
                    _day[subject.number] = subject
                })

                if (schedule[day.date.split('T')[0]][day.groupName]) schedule[day.date.split('T')[0]][day.groupName] = _day
                else {
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
        console.log(schedule)
        setSked(schedule)
    }, [data])

    return (
        <div className={styles.container}>
            {sked && Object.keys(sked).map(date =>
                <VerticalTable schedule={sked[date]} date={date}/>
            )}
        </div>
    );
};

export default Compare2;