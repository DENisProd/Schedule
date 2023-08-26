import React, {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../utils/urlsUtils";
import {SelectInput} from "../UIKit/SelectInput/SelectInput";
import {Link, useNavigate} from "react-router-dom";
import cn from 'classnames'
import styles from './create-test.module.scss';
import {Dropdown} from "../UIKit/DropdownNew/Dropdown";
import {CATEGORIES} from "../CreateSchedule/Stage1/CreateUniversityStage1";
import {checkGroups} from "../../utils/localStorageHelpers";
import Loader2 from "../Loader/Loader2";

export const BLOCKED_CREATE_UNIVERSITY = [
    'DGTU', 'RGEU'
]

export const CreateTest = () => {
    const navigate = useNavigate()

    const [universities, setUniversities] = useState([])
    const [universitiesFullName, setUniversitiesFullName] = useState([])
    const [universitiesFull, setUniversitiesFull] = useState([])
    const [university, setUniversity] = useState('')
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [groups, setGroups] = useState(null)
    const [filteredGroups, setFilteredGroups] = useState(null)
    const [type, setType] = useState('UNIVERSITY')
    const [searchValue, setSearchValue] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        axios.get(URLS.UNIVERSITY).then(res => {
            setUniversitiesFull(res.data)
            let _un = {};
            let _un2 = {};
            let arr = [];
            if (Array.isArray(res.data)) {
                res.data.forEach(univer => {
                    const code = univer?.code?.toLowerCase()
                    arr.push({
                        ...univer,
                        optionName: univer.full_name
                    })
                    if (code) {
                        if (!university) setUniversity(code)
                        _un[code] = univer.short_name
                        _un2[code] = univer.full_name
                    }
                });
                setData(arr)
                setFilteredData(arr.filter(u => u.type === 'UNIVERSITY'))
                setUniversities(_un)
                setUniversitiesFullName(_un2)
                setIsLoading(false)
            }
        });

        // getGroupsByUniverCode()
    }, [])

    const onSelectUniversity = (value) => {
        setUniversity(value)
        getGroupsByUniverCode(value?.code)
    }

    const getGroupsByUniverCode = (_code) => {
        console.log(_code)
        axios.get(URLS.ACADEMIC_GROUPS + 'code/' + _code).then(res => {
            let obj = []
            if (Array.isArray(res.data)) {
                res.data.map(el => obj.push(el))
            }
            setGroups(obj)
            setFilteredGroups(obj)
        })
    }

    const addToSearched = (group) => {
        let _group = {
            groupID: group.groupID,
            name: group.name,
            level: group.level,
            id: group._id,
            universityName: university.short_name,
            university: university.code,
            faculty: group.faculty
        }

        localStorage.setItem("groupId2", JSON.stringify(_group))
        let searchList = JSON.parse(localStorage.getItem("searchList2"))
        if (!searchList) searchList = []
        searchList.push(_group)
        localStorage.setItem("searchList2", JSON.stringify(searchList))
        // const myGroup = localStorage.getItem('my-group')
        const myGroup = checkGroups("my-group2")
        if (!myGroup) {
            const fav = [_group]
            localStorage.setItem('favorites2', JSON.stringify(fav))
            localStorage.setItem("my-group2", JSON.stringify(_group));
        }
        navigate('/group/' + _group.id + '?u=' + university)
    }

    const typeHandler = (value) => {
        setType(value)
        setFilteredData(data.filter(u => u.type === value.value))
    }

    useEffect(() => {
        console.log(university)
    }, [university])

    const searchHandle = (event) => {
        setSearchValue(event.target.value)
        if (Array.isArray(groups))
            setFilteredGroups(groups.filter(group => group.name.toLowerCase().includes(event.target.value.toLowerCase() || '')))
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <button onClick={() => navigate('/')}>
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18L3 10M3 10L10 2M3 10H37.5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                </button>
                <h2>Поиск</h2>
            </div>
            {/*<SelectInput options={universitiesFullName} value={universitiesFullName[university]}*/}
            {/*             onChange={onSelectUniversity}/>*/}
            <div>
                {/*<div className={styles.field_title}>Выберите тип</div>*/}
                {/*<SelectInput options={CATEGORIES} value={CATEGORIES["UNIVERSITY"]} onChange={typeHandler}*/}
                {/*             placeholder={"Выберете тип создания"}/>*/}
                <Dropdown optionList={CATEGORIES} defaultValue={CATEGORIES[0]} placeholder={"Выберите тип"} setSelectedValue={typeHandler}/>
            </div>

            <div>
                {/*<div className={styles.field_title}>Выберите организацию</div>*/}
                <Dropdown optionList={filteredData} defaultValue={filteredData[0]} placeholder={"Выберите учебное заведение"}
                          setSelectedValue={onSelectUniversity}/>
            </div>

            <div className={styles.search_field}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.9706 13.072L17 17M15.2269 7.95238C15.2269 11.7921 12.0421 14.9048 8.11343 14.9048C4.18479 14.9048 1 11.7921 1 7.95238C1 4.11268 4.18479 1 8.11343 1C12.0421 1 15.2269 4.11268 15.2269 7.95238Z"
                        stroke="#9C9D9F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>

                <input value={searchValue} onChange={searchHandle} placeholder={"Поиск..."}/>
            </div>

            <div className={styles.groups_container}>
                {isLoading &&
                    <div style={{display: 'flex', justifyContent: 'center', margin: '2rem auto'}}>
                        <Loader2/>
                    </div>
                }
                {!BLOCKED_CREATE_UNIVERSITY.includes(university.code) &&
                    <div className={styles.sub_title}>
                        <div style={{textAlign: 'center'}}>Нет вашей группы или университета? <Link
                            style={{color: 'var(--text-color)'}} to={'/create/'}>Создайте</Link></div>
                    </div>
                }
                <div className={cn(styles.groups_tile, styles.no_back)}>
                    <div>Группа</div>
                    <div>Курс</div>
                    <div>Факультет</div>
                    {/*<div>{group.university && universities[group.university]}</div>*/}
                </div>
                {Array.isArray(filteredGroups) &&
                    <>
                        {filteredGroups.length > 0 ?
                            filteredGroups.map(group =>
                                <div className={styles.groups_tile}
                                     key={group.id}
                                     onClick={() => {
                                         addToSearched(group)
                                         navigate("/group/" + (university.code === 'DGTU' ? group.groupID : group.name) + '?u=' + (university.code === undefined ? 'dgtu' : university.code))
                                     }}
                                >
                                    <div>{group?.name}</div>
                                    <div>{group?.level}</div>
                                    <div>{group?.faculty}</div>
                                    {/*<div>{group.university && universities[group.university]}</div>*/}
                                </div>
                            )
                            :
                            <div className={cn(styles.groups_tile, styles.flex)}>
                                <div>Ничего не найдено</div>
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    )
}