import React, {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../../utils/urlsUtils";
import {Dropdown} from "../../UIKit/DropdownNew/Dropdown";
import {CATEGORIES} from "../../CreateSchedule/Stage1/CreateUniversityStage1";
import cn from 'classnames'

import univerStyles from './change-univer.module.scss'

export const ChangeUniversity = ({ isUniverVisible = true, setSelectedUniversity }) => {
    const [university, setUniversity] = useState('')
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [type, setType] = useState('UNIVERSITY')

    useEffect(() => {
        const uuid = localStorage.getItem('clientId') || 0
        axios.get(URLS.UNIVERSITY+'?user='+uuid).then(res => {
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
            }
        });
    }, [])

    const onSelectUniversity = (value) => {
        setUniversity(value)
        setSelectedUniversity(value)
    }

    useEffect(() => {

    }, [university])

    const typeHandler = (value) => {
        setType(value)
        setUniversity('')
        setFilteredData(data.filter(u => u.type === value.value))
    }

    return (
        <div className={cn(univerStyles.container, isUniverVisible && univerStyles.visible)}>
            <div>
                <Dropdown optionList={CATEGORIES} defaultValue={CATEGORIES[0]} placeholder={"Выберите тип"} setSelectedValue={typeHandler}/>
            </div>

            <div>
                <Dropdown optionList={filteredData} defaultValue={filteredData[0]} placeholder={"Выберите учебное заведение"}
                          setSelectedValue={onSelectUniversity}/>
            </div>
        </div>
    )
}