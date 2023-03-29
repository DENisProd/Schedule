import {useEffect, useRef, useState} from "react";
import axios from "axios";

import './compare.css'

function groupByDate (data, field) {
    const array = data.data.rasp
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

    return {obj: obj, date: data.data.info.date.split("T")[0]}
}

function createMatrix (merged, groupList) {
    let table = {}
    let tables = []
    const obj = Object.keys(merged)

    obj.map(date => {
        table = []
        table[0] = groupList

            const groups = merged[date]
            const groupsIds = Object.keys(groups)

            for (let j = 0; j < groupsIds.length; j++) {
                const temp = groups[groupsIds[j]]
                console.log(temp)

                Object.keys(temp).map(n => {
                    console.log(temp[n])
                    if (table[n]) table[n].push(temp[n])
                    else table[n] = [ temp[n] ]
                    // table[n].push(temp[Object.keys(temp)[0]])
                })
                // console.log( temp[Object.keys(temp)[0]] )
                //
                // table.push([ temp[Object.keys(temp)[0]] ])
            }


        tables[date] = table
    })

    console.log(table)
    console.log(tables)
    return tables
}

function mergeGroupedObjects(objects, monday, groupsId) {
    let mergedObject = {}
    console.log(objects)
    let date = new Date(monday)

    mergedObject[monday] = {}
    for (let i = 0; i < groupsId.length; i++) {
        mergedObject[monday][groupsId[i]] = {
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
            7: {},
        }
    }

    for (let i = 0; i < 6; i++) {
        date.setDate(date.getDate()+1)
        const nextDay = date.toISOString().split("T")[0]
        mergedObject[nextDay] = {}
        for (let i = 0; i < groupsId.length; i++) {
            mergedObject[nextDay][groupsId[i]] = {
                    1: {},
                    2: {},
                    3: {},
                    4: {},
                    5: {},
                    6: {},
                    7: {},
                }
        }
    }

    // for (let i = 0; i < groupsId.length; i++) {
    //     objects.map(obj => {
    //         Object.keys(mergedObject).map(date => {
    //             mergedObject[date] = {[groupsId[i]]: {
    //                     1: {},
    //                     2: {},
    //                     3: {},
    //                     4: {},
    //                     5: {},
    //                     6: {},
    //                     7: {},
    //                 }}
    //         })
    //     })
    // }


    console.log(mergedObject)

    objects.map(obj => {
        const temp = Object.values(obj)[0]
        const groupId = Object.keys(obj)[0]
        console.log(temp)



        Object.keys(temp).map(date => {
            let day = {
                1: {},
                2: {},
                3: {},
                4: {},
                5: {},
                6: {},
                7: {},
            }
            temp[date].map(para => {
                day[para["номерЗанятия"]] = para
            })
            if (mergedObject[date]) mergedObject[date][groupId] = day
            else mergedObject[date] = {[groupId]: day}
        })
    })

    console.log(mergedObject)

    return mergedObject
}

export default function Compare({compareList2}) {
    // Кэш результатов запросов
    const [data, setData] = useState([])
    // группированный объект по датам и группам (дата: {группа1: [], группа2: []})
    const [groupedSchedule, setGroupedSchedule] = useState([])
    const [matrix, setMatrix] = useState([])
    const [attempt, setAttempt] = useState(1)

    const compareList = [44461, 44757, 44464, 43750, 44822, 44439, 45138, 43868]

    const setAndProcessing = (object) => {
        setData(prev => [...prev, object])
        const answer = groupByDate(object, 'дата')
        console.log(answer)
        //createMatrix(object)
        return answer
    }

    // const createMatrix = () => {
    //
    // }


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
                    resolve({})
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
        let date = null
        compareList
            .reduce((accum, item) => {
                return accum
                    .then(res => fetchGroup(item, res).then(res => {
                        console.log(res)
                        const tempObjKey = Object.keys(res)[0]
                        object.push({[tempObjKey]: res[tempObjKey].obj})
                        date = res[tempObjKey].date
                    }))
            }, Promise.resolve())
            .then(result => callback(object, date));
    }

    const fetchSeries = (result, date) => {
        const merged = mergeGroupedObjects(result, date, compareList)
        setGroupedSchedule(merged)
        const _matrix = createMatrix(merged, compareList)
        console.log(_matrix)
        const sortedMatrix = Object.fromEntries(Object.entries(_matrix).sort())
        console.log(sortedMatrix)
        setMatrix(sortedMatrix)
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
            <div>
                {Object.keys(matrix).map(date =>
                <div>
                    <h5>{date}</h5>
                    <table>
                        {/*{console.log(matrix[date])}*/}
                        {matrix[date].map((line, index) =>
                        <tr>
                            {Object.keys(line).map(col =>
                                <td style={{textAlign: 'center', height: '2em', width: '8em', background: `${line[col]["аудитория"] ? 'green' : 'red' }`}}>
                                    {index===0 ? line[col] : line[col]["аудитория"] && line[col]["аудитория"]}
                                </td>
                            )}
                        </tr>
                        )}
                    </table>
                </div>


                )}
            </div>
            {/*{Object.keys(groupedSchedule).map(date =>*/}
            {/*    <div className="compare-horizontal">*/}
            {/*        {Object.keys(groupedSchedule[date]).map(group =>*/}
            {/*            <div>*/}
            {/*                {Object.keys(groupedSchedule[date][group]).map(number =>*/}
            {/*                    <div>*/}
            {/*                        <span>{number} </span>*/}
            {/*                        {groupedSchedule[date][group][number]["аудитория"]}*/}
            {/*                    </div>*/}
            {/*                )}*/}
            {/*                /!*<p>{group}</p>*!/*/}
            {/*                /!*<p>{groupedSchedule[date][group].map(lesson =>*!/*/}
            {/*                /!*    <p>{lesson['аудитория']} {lesson['номерЗанятия']}</p>*!/*/}

            {/*                /!*)}</p>*!/*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*)}*/}
            {compareList.length > 0 ?
                <div>{compareList.map(groupId => groupId + " ")}</div>
                :
                <h5>Нечего сравнивать</h5>
            }
        </div>
    )
}