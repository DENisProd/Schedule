import {useEffect, useRef, useState} from "react";
import axios from "axios";

import './compare.css'

function groupByDate (array, field) {
    let obj = {}
    for (let i = 0; i < array.length; i++) {
        const date = array[i][field].split("T")[0]
        if (obj[date]?.length > 0) {
            if (array[i - 1][field].split("T")[0] === date)
                obj[date].push({...array[i]})
        } else {
            obj[date] = [];
            obj[date].push({...array[i]})
        }
    }
    return obj;
}

function mergeGroupedObjects(objects) {
    let mergedObject = {}
    objects.map(obj => {
        const temp = Object.values(obj)[0]
        const groupId = Object.keys(obj)[0]

        Object.keys(temp).map(date => {
            if (mergedObject[date]) mergedObject[date][groupId] = temp[date]
            else mergedObject[date] = {[groupId]: temp[date]}
        })
    })

    return mergedObject
}

export default function Compare({compareList}) {
    // Кэш результатов запросов
    const [data, setData] = useState([])
    // группированный объект по датам и группам (дата: {группа1: [], группа2: []})
    const [groupedSchedule, setGroupedSchedule] = useState([])
    const [attempt, setAttempt] = useState(1)

    const compareList2 = [44461, 44757, 44464]

    const setAndProcessing = (object) => {
        setData(prev => [...prev, object])
        const answer = groupByDate(object.data.rasp, 'дата')
        return answer
    }


    const fetchGroup = (groupID) => {
        return new Promise((resolve, reject) => {
            console.log(groupID)
            const date = new Date()
            axios
                .get("https://edu.donstu.ru/api/Rasp?idGroup=" + groupID + `&sdate=${date.toISOString().split('T')[0]}`)
                .then(res => {
                    let isExists = false
                    // console.log(res.data)
                    if (data) {
                        const groupId = res.data.data.info.group.groupID

                        data.map(gr => {
                            if (gr.data.info.group.groupID === groupId) {
                                isExists = true
                            }
                        })

                        if (!isExists)
                            resolve({[groupId]: setAndProcessing(res.data)})

                    } else {
                        resolve(setAndProcessing(res.data))
                    }

                })
                .catch(e => {
                    console.log('ошибка')

                    setTimeout(() => {
                        setAttempt(attempt + 1)
                        console.log(attempt)
                        if (attempt < 3) {
                            //fetchGroup(groupID)
                            return
                        } else {
                            console.log('я не знаю, что делать, мне ТТК даёт по рукам ((((((')
                            return
                        }

                    }, 1000);
                })
        })
    }

    function reduceWay(callback) {
        let object = []
        compareList
            .reduce((accum, item) => {
                return accum
                    .then(res => fetchGroup(item, res).then(res => object.push(res)))
            }, Promise.resolve())
            .then(result => callback(object));
    }

    const fetchSeries = (result) => {
        setGroupedSchedule(mergeGroupedObjects(result))
    }

    useEffect(() => {
        reduceWay(fetchSeries)
        console.log(data)
        // if (compareList) {
        //     setData([])
        //     fetchData(print)
        //     console.log(data)
        // }

    }, [])

    return (
        <div className="compare-container">
            {Object.keys(groupedSchedule).map(date =>
                <div className="compare-horizontal">
                    {Object.keys(groupedSchedule[date]).map(group =>
                        <div>
                            <p>{group}</p>
                            <p>{groupedSchedule[date][group].map(lesson =>
                                <p>{lesson['аудитория']} {lesson['номерЗанятия']}</p>

                            )}</p>
                        </div>
                    )}
                </div>
            )}
            {compareList.length > 0 ?
                <div>{compareList.map(groupId => groupId + " ")}</div>
                :
                <h5>Нечего сравнивать</h5>
            }
        </div>
    )
}