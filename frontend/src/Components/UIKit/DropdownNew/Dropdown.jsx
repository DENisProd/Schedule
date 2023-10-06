import styles from "./dropdown.module.scss"
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";

import cn from 'classnames'
import {Link} from "react-router-dom";

export const Dropdown = forwardRef(({
                                        defaultValue,
                                        optionList,
                                        selectedValue,
                                        setSelectedValue,
                                        setObject,
                                        next,
                                        placeholder,
                                        isDisplayEmpty = true,
                                        canWrite = false,
                                        invertedColor = false,
                                        filterFunction
                                    }, ref) => {
    const inputRef = useRef(null)

    const [value, setValue] = useState('')
    const [isMenuVisible, setMenuVisible] = useState(false)
    const [list, setList] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [defaultApplied, setDefaultApplied] = useState(false)

    useEffect(() => {
        setList(optionList)
    }, [optionList])

    useEffect(() => {

        if (!defaultApplied && defaultValue) {

            setValue(defaultValue.optionName);
            setSelectedValue(defaultValue);
            setDefaultApplied(true);
        }
    }, [defaultValue, setSelectedValue, defaultApplied]);

    useEffect(() => {
        // Обработчик клика на всем документе
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        // Добавляем обработчик клика при открытом меню
        if (isMenuVisible) {
            document.addEventListener('click', handleClickOutside);
        }

        // Удаляем обработчик клика при размонтировании компонента или при скрытии меню
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuVisible]);

    const filterFunctionDefault = (item, searchValue) => {
        return item.value.toLowerCase().includes(searchValue.toLowerCase())
    }

    const changeHandler = (event) => {
        if (canWrite) {
            const searchValue = event.target.value
            setValue(searchValue)

            const _filterFunction = filterFunction || filterFunctionDefault
            setList(optionList.filter(item => _filterFunction(item, searchValue)))
            selectOption({ optionName: searchValue, value: searchValue})
            // setList(optionList.filter(group =>
            //     group.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            //     group.short_name.toLowerCase().includes(searchValue.toLowerCase())
            // ))
        }
    }

    const focusHandler = (event) => {

        // setMenuVisible(true)
    }

    const clickHandler = (event) => {

        setMenuVisible(prevState => !prevState)
    }

    const onKeyDownHandler = (event) => {

        if (isMenuVisible) {
            if (event.keyCode === 40) {
                if (selectedIndex >= list.length - 1) setSelectedIndex(0)
                else setSelectedIndex(prevState => prevState + 1)
            }
            if (event.keyCode === 38) {
                if (selectedIndex - 1 < 0) setSelectedIndex(list.length - 1)
                else setSelectedIndex(prevState => prevState - 1)
            }
            if (event.keyCode === 13) {
                selectOption(list[selectedIndex])
            }
        }
    }

    const selectOption = (option) => {
        setValue(option.optionName)
        setMenuVisible(false)
        if (setSelectedValue) setSelectedValue(option)
        if (next) next()
    }

    useImperativeHandle(ref, () => ({
        focus() {
            inputRef.current.focus()
        },
        clear() {
            selectOption({ optionName: '', value: ''})
        }
    }))

    return (
        <div className={styles.container}>
            {canWrite ? (
                <input
                    value={value}
                    onFocus={focusHandler}
                    onChange={changeHandler}
                    ref={inputRef}
                    onKeyDown={onKeyDownHandler}
                    placeholder={placeholder || ''}
                    onClick={clickHandler}
                />
            ) : (
                <div className={cn(styles.nonWritableInput, invertedColor && styles.inverted)} onClick={clickHandler} ref={inputRef}>
                    {value || <span className={styles.placeholder}>{placeholder}</span>}
                </div>
            )}

            <span className={cn(styles.arrow, isMenuVisible && styles.open)}>
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M2.2153 1.07179L2.21548 1.07158L2.20958 1.06704C1.88758 0.819464 1.43024 0.847316 1.13897 1.14914C0.820342 1.47932 0.820342 2.01322 1.13897 2.3434L7.41881 8.85086L7.41861 8.85105L7.42409 8.85595L7.50487 8.92821L7.50468 8.92842L7.51059 8.93296C7.83259 9.18054 8.28993 9.15268 8.58119 8.85086L14.861 2.3434L14.8612 2.34359L14.8659 2.33797L14.9356 2.25427L14.9358 2.25444L14.9401 2.24848C15.1768 1.91796 15.1509 1.44956 14.861 1.14914L14.8612 1.14895L14.8557 1.14405L14.775 1.07179L14.7752 1.07158L14.7692 1.06704C14.4472 0.819464 13.9899 0.847316 13.6986 1.14914L13.7706 1.21858L13.6986 1.14914L8 7.05458L2.30136 1.14914L2.30155 1.14895L2.29607 1.14405L2.2153 1.07179Z"
                            fill="white" stroke="black" strokeWidth="0.2"/>
                    </svg>
            </span>

            <div className={cn(styles.menu, isMenuVisible && styles.open)}>
                {Array.isArray(list) &&
                    <>
                        {list.length > 0 ?
                            <>
                                {list.map((row, index) =>
                                    <div className={cn(styles.option, index === selectedIndex && styles.selected)}
                                         onClick={() => selectOption(row)}>
                                        {row.optionName}
                                    </div>
                                )}
                            </>
                            :
                            <>
                                {isDisplayEmpty &&
                                    <div className={styles.sub_title}>
                                        <div className={cn(styles.option)}>Номера пар не найдены</div>
                                    </div>
                                }
                            </>
                        }
                    </>
                }
            </div>
        </div>
    )
})