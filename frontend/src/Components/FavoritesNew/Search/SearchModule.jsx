import {useNavigate} from "react-router-dom";
import React, {useEffect, useState, Children, createRef} from "react";
import axios from "axios";
import styles from "./search.module.scss"
import Loader from "../../Loader/Loader";
import TabBar, {TabContent, TabGroup} from "../../UIKit/TabBar/TabBar";
import cn from "classnames"

const searchList = {
    0: "группе",
    1: "преподавателям",
    2: "аудиториям"
}

const SearchModule = ({_setActiveTab, _setIsSearching}) => {

    const [isSearching, setIsSearching] = useState(false)
    const searchInput = createRef()

    let timeout = null

    const [activeTab, setTab] = useState(0)

    const [value, setValue] = useState('')

    const setActiveTab = (tab) => {
        if (isSearching) {
            cancelTimeout()
            searchInput.current.focus()
        }
        _setActiveTab(tab)
        setTab(tab)
    }

    const blurWithTimeout = () => {
        timeout = setTimeout(() => {
            setIsSearching(false)
            _setIsSearching(false)
        }, 200)
    }

    const cancelTimeout = () => {
        clearTimeout(timeout)
    }

    return (
        <>
            {/*<TabBar tabs={searchList}/>*/}
            <TabGroup className={styles.tab_group} changeState={setActiveTab} header={
                <input type="text"
                       onFocus={() => {
                           setIsSearching(true)
                           _setIsSearching(true)
                       }
                       }
                       onBlur={() => blurWithTimeout()}
                       className={styles.search_input}
                       placeholder={"Поиск по " + searchList[activeTab]}
                       value={value}
                       onChange={(e) => setValue(e.target.value)}
                       ref={searchInput}
                />
            }>
                <TabContent label="Группе">
                    <ConditionLayer state={isSearching}>
                        <GetInfoAndRender tab={activeTab} value={value}/>
                    </ConditionLayer>
                </TabContent>
                <TabContent label="Преподаватель">
                    <ConditionLayer state={isSearching}>
                        <GetInfoAndRender tab={activeTab} value={value}/>
                    </ConditionLayer>
                </TabContent>
                <TabContent label="Аудитория">
                    <ConditionLayer state={isSearching}>
                        <GetInfoAndRender tab={activeTab} value={value}/>
                    </ConditionLayer>
                </TabContent>
            </TabGroup>
        </>
    )
}

export default SearchModule

function ConditionLayer({children, state, setState}) {
    return (
        <div className={cn(styles.list, state && styles.active)}>
            {state && <>{children}</>}
        </div>
    )
}

function GetInfoAndRender ({tab, value}) {
    const navigate = useNavigate()

    const [groupsList, setGroupList] = useState([])
    const [teachersList, setTeachersList] = useState([])
    const [roomsList, setRoomsList] = useState([])

    const filteredGroups = groupsList.filter(group => {
        return group.name.toLowerCase().includes(value.toLowerCase())
    })

    const filteredTeachers = teachersList.filter(teacher => {
        return teacher?.name?.toLowerCase().includes(value.toLowerCase())
    })

    const filteredRooms = roomsList.filter(room => {
        return room?.name?.toLowerCase().includes(value.toLowerCase())
    })

    const [isLoaded, setIsLoaded] = useState(false)

    const getInfo = (tab) => {
        switch (tab) {
            case 0:
                if (groupsList.length === 0) {
                    axios("https://edu.donstu.ru/api/raspGrouplist?year=2022-2023").then(res => {
                        setGroupList(res.data.data)
                        setIsLoaded(true)
                    })
                        .catch(err => {
                            setTimeout(() => {
                                console.log("Ошибка соединения (((")
                                getInfo(tab)
                            }, 1000);
                        })
                } else {
                    setIsLoaded(true)
                }
                break
            case 1:
                if (teachersList.length === 0) {
                    axios("https://edu.donstu.ru/api/raspTeacherlist?year=2022-2023").then(res => {
                        setTeachersList(res.data.data)
                        setIsLoaded(true)
                    })
                        .catch(err => {
                            setTimeout(() => {
                                console.log("Ошибка соединения (((")
                                getInfo(tab)
                            }, 1000);
                        })
                } else {
                    setIsLoaded(true)
                }
                break
            case 2:
                if (roomsList.length===0) {
                    axios("https://edu.donstu.ru/api/raspAudlist?year=2022-2023")
                        .then(res => {
                            setRoomsList(res.data.data)
                            setIsLoaded(true)
                        })
                        .catch(err => {
                            setTimeout(() => {
                                console.log("Ошибка соединения (((")
                                getInfo(tab)
                            }, 1000);
                        })
                } else {
                    setIsLoaded(true)
                }
                break
            default: break
        }
    }

    const getTable = () => {
        switch (tab) {
            case 0: {
                return (
                    <table>
                        <thead>
                        <tr>
                            <th>Группа</th>
                            <th>Курс</th>
                            <th>Факультет</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredGroups.slice(0,100).map(group =>
                            <tr key={group.id} onClick={() => {
                                localStorage.setItem("groupId", group.id)
                                let searchList = JSON.parse(localStorage.getItem("searchList"))
                                if (!searchList) searchList = []
                                searchList.push(group.name)
                                localStorage.setItem("searchList", JSON.stringify(searchList))

                                navigate('/group/' + group.id)}
                            }>
                                {/*<td>{group.id}</td>*/}
                                <td>{group.name}</td>
                                <td>{group.kurs}</td>
                                <td>{group.facul}</td>
                                {/*<td>{group.facultyID}</td>*/}
                            </tr>
                        )}
                        </tbody>
                    </table>
                )
            }
            case 1: {
                return (
                    <table>
                        <thead>
                        <tr><th>Фамилия Имя Отчество</th></tr>
                        </thead>
                        <tbody>
                        {filteredTeachers.slice(0,100).map(teachers =>
                            <tr key={teachers.id}
                                onClick={() => {
                                    navigate('/teacher/' + teachers.id)}
                                }>
                                <td>{teachers.name}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )
            }
            case 2: {
                return (
                    <table>
                        <thead>
                        <tr><th>Аудитория</th></tr>
                        </thead>
                        <tbody>
                        {filteredRooms.slice(0,100).map(room =>
                                <tr onClick={() => {
                                    navigate('/room/' + room.id)}
                                }
                                    key={room.id}>
                                    <td>{room.name}</td>
                                </tr>
                            // <tr>{teacher.name}</tr>
                        )}
                        </tbody>
                    </table>
                )
            }
            default: break
        }
    }

    useEffect(() => {
        setIsLoaded(false)
        getInfo(tab)
    }, [])

    return (
        <>
            {isLoaded ?
                <>
                    {getTable()}
                </>
            :
            <h2>Загрузка...</h2>
            }
        </>
    )
}