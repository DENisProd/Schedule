import {useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";

import styles from "./favorites.module.scss"
import SearchModule from "./Search/SearchModule";
import cn from "classnames";
import {checkGroups} from "../../utils/localStorageHelpers";
import ErrorBoundary from "../../utils/ErrorBoundary";

import CrownIcon from '../../assets/crown.svg'
import axios from "axios";
import {URLS} from "../../utils/urlsUtils";

const favoritesList = [
    "группы",
    "преподаватели",
    "аудитории"
]

const _universities = {
    "dstu": "ДГТУ",
    "rsue": "РГЭУ"
}

const FavoritesNew = () => {
    const navigate = useNavigate();

    const searchModuleRef = useRef(null);
    const [groupsList, setGroupList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isGroupChoose, setIsGroupChoose] = useState(false);
    const [myGroup, setIsMyGroup] = useState(null);
    const [universities, setUniversities] = useState(_universities)

    const [isSearching, setIsSearching] = useState(false)
    const [activeTab, setActiveTab] = useState(0)

    const [value, setValue] = useState("");

    let filteredGroups = [];

    useEffect(() => {
        loadFavorites()
    }, [])

    useEffect(() => {
        if (groupsList) {
            axios.get(URLS.UNIVERSITY).then(res => {
                let _un = {};
                if (Array.isArray(res.data)) {
                    res.data.forEach(univer => {
                        const code = univer?.code?.toLowerCase()
                        if (code) _un[code] = univer.short_name;
                    });
                    setUniversities(prevState => ({ ...prevState, ..._un }));
                }
            });
        }
    }, [groupsList, setUniversities])

    useEffect(() => {
        console.log(universities)
    }, [universities])

    const loadFavorites = () => {
        let data = JSON.parse(localStorage.getItem("favorites2"))
        if (data) {
            let filtered = data.filter(gr => gr.hasOwnProperty('name') === true)
            setGroupList(filtered)
            getMyGroup()
        }
        setIsLoaded(true)
    }

    window.addEventListener("storage", (event) => {
        //console.log(event);
    })

    const getMyGroup = () => {
        const myGroupFromStorage = checkGroups("my-group2")
        if (myGroupFromStorage) setIsMyGroup(myGroupFromStorage);
    }

    const chooseButtonHandler = (state) => {
        if (groupsList.length > 0)
            setIsGroupChoose(state)
    }

    const chooseHandler = (group) => {
        localStorage.setItem("my-group2", JSON.stringify(group));
        setIsGroupChoose(false)
        getMyGroup()
    }

    const removeFavorite = (id) => {
        let groupFromStorage = JSON.parse(localStorage.getItem("favorites2"))
        groupFromStorage = groupFromStorage.filter(gr => (gr?.id !== id))
        localStorage.setItem("favorites2", JSON.stringify(groupFromStorage))
        loadFavorites()
        setIsGroupChoose(false)
    }

    const wantChooseGroup = () => {
        if (groupsList.length > 0) {
            chooseButtonHandler(true)
        } else {
            //focusSearchInput()
            navigate('/test/')
        }
    }

    const focusSearchInput = () => {
        if (searchModuleRef.current && typeof searchModuleRef.current.focusSearchInput === 'function') {
            searchModuleRef.current.focusSearchInput();
        }
    }

    const redirectToView = (group) => {
        let link = ''
        if (group.university === 'DGTU') link = group.groupID + '?u=' + group.university
        else link = group.name + '?u=' + group.university
        navigate("/group/" + link)
    }

    return (
        <ErrorBoundary>
            <div className={styles.favorites_screen}>
                {/*<div className={styles.search_container}>*/}
                {/*    <SearchModule _setIsSearching={setIsSearching} _setActiveTab={setActiveTab} ref={searchModuleRef}/>*/}
                {/*</div>*/}
                {/*{!isSearching &&*/}
                    <div className={styles.favorites_back}>
                        <div className={styles.title}>
                            <div/>
                            <h2>Избранные {favoritesList[activeTab]}</h2>
                            <div className={styles.button_container}>
                                <button className={styles.search_button} onClick={() => navigate('/test/')}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.9706 13.072L17 17M15.2269 7.95238C15.2269 11.7921 12.0421 14.9048 8.11343 14.9048C4.18479 14.9048 1 11.7921 1 7.95238C1 4.11268 4.18479 1 8.11343 1C12.0421 1 15.2269 4.11268 15.2269 7.95238Z" stroke="#9C9D9F" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className={styles.favorites_container}>
                            {groupsList.length > 0 ? (
                                <>
                                    {groupsList.map((group) => (
                                        <>
                                            {isGroupChoose ? (
                                                <div className={cn(styles.tile, myGroup?.id === group?.id && styles.my)} key={group?.id}
                                                onClick={() => chooseHandler(group)}>
                                                    <img className={styles.crown} src={CrownIcon}/>
                                                    <div className={styles.inner_cont}>
                                                        <div className={styles.name}>
                                                            {group.name}
                                                        </div>
                                                        <div className={styles.faculty}>{group?.faculty}</div>

                                                        {/*<div className={styles.university}>*/}
                                                        <div>
                                                            {group.university && universities[group.university]}
                                                        </div>
                                                        <div className={styles.actions}>
                                                            <button name={'btn' + group.id} className={styles.btn}
                                                                    onClick={() => removeFavorite(group.id)}>X
                                                            </button>
                                                            {/*<input*/}
                                                            {/*    type="checkbox"*/}
                                                            {/*    className={styles.btn}*/}
                                                            {/*    name={group.id}*/}
                                                            {/*    onChange={(e) =>*/}
                                                            {/*        chooseHandler(group)*/}
                                                            {/*    }*/}
                                                            {/*/>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={cn(styles.tile, myGroup?.id === group.id && styles.my)}
                                                     key={group.id}
                                                     onClick={() => redirectToView(group)}>
                                                    <img className={styles.crown} src={CrownIcon}/>
                                                    <div className={styles.inner_cont}>
                                                        <div className={styles.name}>{group.name}</div>
                                                        <div className={styles.actions}>{group.level}</div>
                                                        <div className={styles.faculty}>{group?.faculty}</div>
                                                        <div className={styles.university}>{group.universityName}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ))}
                                </>
                            ) : (
                                <h5 style={{textAlign: 'center'}}>Вы ещё не добавили группы в избранное</h5>
                            )}
                        </div>
                    </div>
                {/*}*/}

                <div className={styles.bottom_container}>
                    {isGroupChoose ? (
                        <button onClick={() => chooseButtonHandler(false)}>
                            Отмена
                        </button>
                    ) : (
                        <button onClick={wantChooseGroup}>
                            Выбрать мою группу
                        </button>
                    )}
                </div>

            </div>
        </ErrorBoundary>
    )
}

export default FavoritesNew