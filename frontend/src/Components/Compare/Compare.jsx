import {useEffect, useState} from "react";
import axios from "axios";

import './compare.css'
import {getMondayOfWeek, getWeek} from "../../utils/groupHelpers";
import {useDispatch, useSelector} from "react-redux";
import {fetchGroups} from "../../asyncActions/groups";
import dayjs from "dayjs";

function isExists (group, groupId, date) {
    if (group.id === Number(groupId)) {
        const date1 = dayjs(group.date)
        const date2 = dayjs(date)
        if (date1.isSame(date2)) {
            return true
        }
    }

    return false
}

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
    // console.log(data.data.info.group.name)
    // console.log({obj: obj, date: data.data.info.date.split("T")[0]})
    return {obj: obj, date: data.data.info.date.split("T")[0], name: data.data.info.group.name }
}

function createMatrix (merged, groupList, groupNameList) {
    let table = {}
    let tables = []
    const obj = Object.keys(merged)

    obj.map(date => {
        table = []
        let grs = []

        groupList.map(e => grs.push(groupNameList[e]))
        table[0] = grs || groupList

            const groups = merged[date]
            const groupsIds = Object.keys(groups)

            for (let j = 0; j < groupsIds.length; j++) {
                const temp = groups[groupsIds[j]]

                Object.keys(temp).map(n => {
                    if (table[n]) table[n].push(temp[n])
                    else table[n] = [ temp[n] ]
                })
            }

        tables[date] = table
    })
    return tables
}

function mergeGroupedObjects(objects, monday, groupsId) {
    let mergedObject = {}
    let date = new Date(monday)

    const emptyDay = {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
    }

    mergedObject[monday] = {}
    for (let i = 0; i < groupsId.length; i++) {
        mergedObject[monday][groupsId[i]] = emptyDay
    }

    for (let i = 0; i < 6; i++) {
        date.setDate(date.getDate()+1)
        const nextDay = date.toISOString().split("T")[0]
        mergedObject[nextDay] = {}
        for (let i = 0; i < groupsId.length; i++) {
            mergedObject[nextDay][groupsId[i]] = emptyDay
        }
    }

    objects.map(obj => {
        const temp = Object.values(obj)[0]
        const groupId = Object.keys(obj)[0]
        Object.keys(temp).map(date => {
            let day = structuredClone(emptyDay)
            temp[date].map(para => {
                day[para["номерЗанятия"]] = para
            })
            if (mergedObject[date]) mergedObject[date][groupId] = day
            else mergedObject[date] = {[groupId]: day}
        })
    })

    return mergedObject
}

export default function Compare({compareList, groupsList}) {
    const [todayDate, setTodayDate] = useState(null)
    const [currentSked, setCurrentSked] = useState([])
    const [currentWeek, setCurrentWeek] = useState([])
    const [groupsFetched, setGroupFetched] = useState(0)
    const dispatch = useDispatch()
    const groups = useSelector(state => state.groups.groups)

    // Кэш результатов запросов
    const [data, setData] = useState([])
    // группированный объект по датам и группам (дата: {группа1: [], группа2: []})
    const [groupedSchedule, setGroupedSchedule] = useState([])
    const [matrix, setMatrix] = useState([])
    const [attempt, setAttempt] = useState(1)


    const compareList2 = [44461, 44757, 44464, 43750, 44822, 44439, 45138, 43868]

    const setAndProcessing = (object) => {
        setData(prev => [...prev, object])
        const answer = groupByDate(object, 'дата')
        // console.log(answer)
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
                        const tempObjKey = Object.keys(res)[0]
                        object.push({[tempObjKey]: res[tempObjKey].obj})
                        date = res[tempObjKey].date
                    }))
            }, Promise.resolve())
            .then(result => callback(object, date));
    }

    const fetchSeries = (result, date) => {
        // console.log(result)

        const merged = mergeGroupedObjects(result, date, compareList)
        setGroupedSchedule(merged)
        // console.log(merged)
        const _matrix = createMatrix(merged, compareList, groupsList)
        // console.log(_matrix)
        const sortedMatrix = Object.fromEntries(Object.entries(_matrix).sort())
        // console.log(sortedMatrix)
        setMatrix(sortedMatrix)
    }

    const findGroup = (groupId, date) => {
        const _date = dayjs(date).startOf('week').add(1, 'day').format('YYYY-MM-DD')
        return groups.find(group => isExists(group, groupId, _date));
    }

    const getIfNotExist = (date, groupId) => {
        const isExists = !!findGroup(groupId, date)
        if (!isExists) {
            // console.log("dispatch")
            dispatch(fetchGroups(groupId, date))
        }
        else {
            const mondayString = getMondayOfWeek(date)
            setTodayDate(mondayString)
            // updateSchedule()

        }
    }



    useEffect(() => {
        // setCurrentSked([])
        // // console.log(compareList)
        // let mondayString
        // if (!todayDate) {
        //     mondayString = getMondayOfWeek()
        //     // console.log(mondayString)
        //     setTodayDate(mondayString)
        // } else {
        //     mondayString = getMondayOfWeek(todayDate)
        // }
        //
        // console.log(mondayString)
        // console.log(groups)
        // const week = getWeek(mondayString)
        // compareList.map(group => {
        //     getIfNotExist(mondayString, group)
        //     // setCurrentSked(prev => [...prev, { [group]: {} }])
        // })
        console.log(groupsList)
        reduceWay(fetchSeries)
        document.getElementById('root').classList.remove('scroll-blocked')
        if (compareList.length === 0) console.log("пусто")
        // console.log(data)
        // if (compareList) {
        //     setData([])
        //     fetchData(print)
        //     console.log(data)
        // }

    }, [])

    const findGroupInCurrent = (groupId) => {
        let isExists = false
        Object.keys(currentSked).map(e => {
            const element = Object.keys(currentSked[e])[0]
            // console.log(element)
            if (Number(element) === Number(groupId)) isExists = true
        })

        return isExists
    }

    useEffect(() => {
        // if (groupsFetched !== compareList.length) {
        //     setGroupFetched(groupsFetched + 1)
        // } else {
        console.log(groups)
        console.log(currentSked)
        const mondayString = getMondayOfWeek(todayDate)

        compareList.map(group => {
            const gr = findGroup(group, mondayString)

            if (gr) {
                console.log(gr.id)

                console.log(findGroupInCurrent(gr.id))
                setCurrentSked(prev => [...prev, { [group]: gr }])
            }

        })
        // setCurrentSked([prev => [...prev, ]])
        // }

    }, [groups])

    return (
        <div className="compare-container">
            <h3>Внимание! Данный функционал ещё в разработке. Возможны баги!</h3>
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
                <div>
                    {Object.keys(matrix).map(date =>
                        <div>
                            <h5>{date}</h5>
                            <table>
                                {/*{console.log(matrix[date])}*/}
                                {matrix[date].map((line, index) =>
                                    <tr>
                                        {Object.keys(line).map(col =>
                                            <td className={`compare-td ${line[col]?.аудитория ? 'green' : 'red' }`}>
                                                {index===0 ? line[col] : line[col]["аудитория"] && line[col]["аудитория"]}
                                            </td>
                                        )}
                                    </tr>
                                )}
                            </table>
                        </div>


                    )}
                </div>
                :
                <h5>Нечего сравнивать. Найдите нужные группы и нажмите "Добавить в сравнение" (кнопка с + в просмотре расписания)</h5>
            }
        </div>
    )
}