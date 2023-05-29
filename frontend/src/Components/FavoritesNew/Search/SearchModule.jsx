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
import {SelectInput} from "../../UIKit/SelectInput/SelectInput";

const searchList = {
    0: "группе",
    1: "преподавателям",
    2: "аудиториям"
}

const universities = {
    "dstu": "Донской государственный технический университет (ДГТУ)",
    "rsue": "Ростовский государственный экономический университет (РГЭУ РИНХ)"
}

const univerTabs = {
    'dstu': {0: true, 1: true, 2: true},
    'rsue': {0: true, 1: false, 2: false},
}

const SearchModule = ({_setActiveTab, _setIsSearching}) => {

    const [isSearching, setIsSearching] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const searchInput = createRef()

    let timeout = null

    const [activeTab, setTab] = useState(0)

    const [value, setValue] = useState('')
    const [university, setUniversity] = useState("dstu")

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

    const cancelTimeout = () => clearTimeout(timeout)
    const onSelectUniversity = (e) => setUniversity(e)


    return (
        <>
            {/*<TabBar tabs={searchList}/>*/}
            <SelectInput options={universities} value={universities[university]} onChange={onSelectUniversity}/>
            <TabGroup className={styles.tab_group} changeState={setActiveTab} header={
                <input type="text"
                       onFocus={() => {
                           setIsSearching(true)
                           _setIsSearching(true)
                       }
                       }
                       // disabled={isLoaded}
                       onBlur={() => blurWithTimeout()}
                       className={styles.search_input}
                       placeholder={"Поиск по " + searchList[activeTab]}
                       value={value}
                       onChange={(e) => setValue(e.target.value)}
                       ref={searchInput}
                />
            }>
                <TabContent label="Группа" enabled={univerTabs[university][0]}>
                    <ConditionLayer state={isSearching} enabled={univerTabs[university][0]}>
                        <GetInfoAndRender setLoaded={setIsLoaded} tab={activeTab} value={value} university={university}/>
                    </ConditionLayer>
                </TabContent>
                <TabContent label="Преподаватель" enabled={univerTabs[university][1]}>
                    <ConditionLayer state={isSearching} enabled={univerTabs[university][1]}>
                        <GetInfoAndRender setLoaded={setIsLoaded} tab={activeTab} value={value} university={university}/>
                    </ConditionLayer>
                </TabContent>
                <TabContent label="Аудитория" enabled={univerTabs[university][2]}>
                    <ConditionLayer state={isSearching} enabled={univerTabs[university][2]}>
                        <GetInfoAndRender setLoaded={setIsLoaded} tab={activeTab} value={value} university={university}/>
                    </ConditionLayer>
                </TabContent>
            </TabGroup>
        </>
    )
}

export default SearchModule


function GetInfoAndRender({tab, value, university, setLoaded}) {
    const [groupsList, setGroupList] = useState([])
    const [teachersList, setTeachersList] = useState([])
    const [roomsList, setRoomsList] = useState([])

    const dispatch = useDispatch()
    const search = useSelector(state => state.search)

    const [isLoaded, setIsLoaded] = useState(false)

    const searchValue = () => {
        setLoaded(false)
        if (value) {
            if (search.groups.data) {
                setGroupList([])
                setGroupList(search.groups.data.filter(group => {
                    return group.name.toLowerCase().includes(value.toLowerCase())
                }))
            }
            if (search.teachers.data) {
                setTeachersList(search.teachers.data.filter(teacher => {
                    return teacher.name.toLowerCase().includes(value.toLowerCase())
                }))
            }
            if (search.rooms.data) {
                setRoomsList([])
                setRoomsList(search.rooms.data.filter(room => {
                    return room.name.toLowerCase().includes(value.toLowerCase())
                }))
            }
        }
    }

    useEffect(() => {
        searchValue()
    }, [value])

    useEffect(() => {
        searchValue()
        if (search.groups) {
            setGroupList(search.groups.data)
            setIsLoaded(true)
            setLoaded(true)
        }
    }, [search.groups, isLoaded])

    useEffect(() => {
        searchValue()
        if (search.teachers.data) {
            setTeachersList(search.teachers.data)
            setIsLoaded(true)
            setLoaded(true)
        }
    }, [search.teachers, isLoaded])

    useEffect(() => {
        searchValue()
        if (search.rooms.data) {
            setRoomsList(search.rooms.data)
            setIsLoaded(true)
            setLoaded(true)
        }
    }, [search.rooms, isLoaded])

    useEffect(() => {
        setIsLoaded(false)
        setLoaded(false)
        const fetchData = (tab) => {
            switch (tab) {
                case 0:
                    dispatch(fetchSearch(SEARCH_TYPES.GROUPS, university))
                    break
                case 1:
                    dispatch(fetchSearch(SEARCH_TYPES.TEACHERS, university))
                    break
                case 2:
                    dispatch(fetchSearch(SEARCH_TYPES.ROOMS, university))
                    break
                // default:
                //     dispatch(fetchSearch(SEARCH_TYPES.GROUPS))
                //     break
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
            <GetTable tab={tab} groupsList={groupsList} teachersList={teachersList} roomsList={roomsList} university={university}/>
        </>
    )
}