import {useNavigate} from "react-router-dom";
import React, {useEffect, useState, Children, createRef} from "react";
import axios from "axios";
import styles from "./search.module.scss"
import Loader from "../../Loader/Loader";
import TabBar, {TabContent, TabGroup} from "../../UIKit/TabBar/TabBar";
import cn from "classnames"
import {useDispatch, useSelector} from "react-redux";
import {fetchSearch, SEARCH_TYPES} from "../../../asyncActions/search";
import ConditionLayer from "./ConditionLayer";
import GetTable from "./GetTable";

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
                <TabContent label="Группа">
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


function GetInfoAndRender({tab, value}) {
    const [groupsList, setGroupList] = useState([])
    const [teachersList, setTeachersList] = useState([])
    const [roomsList, setRoomsList] = useState([])

    const dispatch = useDispatch()
    const search = useSelector(state => state.search)

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        if (value) {
            if (search.groups) {
                console.log(search.groups)
                console.log(value)
                setGroupList([])
                setGroupList(search.groups.filter(group => {
                    return group.name.toLowerCase().includes(value.toLowerCase())
                }))
            }

            setTeachersList(teachersList.filter(teacher => {
                return teacher.name.toLowerCase().includes(value.toLowerCase())
            }))
            setRoomsList(roomsList.filter(room => {
                return room?.name?.toLowerCase().includes(value.toLowerCase())
            }))
        }
    }, [value])

    useEffect(() => {
        setGroupList(search.groups)
        setIsLoaded(true)
    }, [search.groups, isLoaded])

    useEffect(() => {
        setTeachersList(search.teachers)
        setIsLoaded(true)
    }, [search.teachers, isLoaded])

    useEffect(() => {
        setRoomsList(search.rooms)
        setIsLoaded(true)
    }, [search.rooms, isLoaded])

    useEffect(() => {
        setIsLoaded(false)
        const fetchData = (tab) => {
            switch (tab) {
                case 0:
                    dispatch(fetchSearch(SEARCH_TYPES.GROUPS))
                    break
                case 1:
                    dispatch(fetchSearch(SEARCH_TYPES.TEACHERS))
                    break
                case 2:
                    dispatch(fetchSearch(SEARCH_TYPES.ROOMS))
                    break
                default:
                    dispatch(fetchSearch(SEARCH_TYPES.GROUPS))
                    break
            }
        }

        fetchData(tab)
    }, [tab])



    return (
        <>
            {/*{isLoaded ?*/}
            {/*    <>*/}
            {/*        {getTable()}*/}
            {/*    </>*/}
            {/*    :*/}
            {/*    <h2>Загрузка...</h2>*/}
            {/*}*/}
            {/*{getTable()}*/}
            <GetTable tab={tab} groupsList={groupsList} teachersList={teachersList} roomsList={roomsList}/>
        </>
    )
}