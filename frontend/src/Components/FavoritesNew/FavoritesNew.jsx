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
        let data = JSON.parse(localStorage.getItem("favorites"))
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
        const myGroupFromStorage = checkGroups("my-group")
        if (myGroupFromStorage) setIsMyGroup(myGroupFromStorage);
    }

    const chooseButtonHandler = (state) => {
        if (groupsList.length > 0)
            setIsGroupChoose(state)
    }

    const chooseHandler = (group) => {
        localStorage.setItem("my-group", JSON.stringify(group));
        setIsGroupChoose(false)
        getMyGroup()
    }

    const removeFavorite = (id) => {
        let groupFromStorage = JSON.parse(localStorage.getItem("favorites"))
        groupFromStorage = groupFromStorage.filter(gr => (gr?.id !== id))
        localStorage.setItem("favorites", JSON.stringify(groupFromStorage))
        loadFavorites()
        setIsGroupChoose(false)
    }

    const wantChooseGroup = () => {
        if (groupsList.length > 0) {
            chooseButtonHandler(true)
        } else {
            focusSearchInput()
        }
    }

    const focusSearchInput = () => {
        if (searchModuleRef.current && typeof searchModuleRef.current.focusSearchInput === 'function') {
            searchModuleRef.current.focusSearchInput();
        }
    };

    return (
        <ErrorBoundary>
            <div className={styles.favorites_screen}>
                <div className={styles.search_container}>
                    <SearchModule _setIsSearching={setIsSearching} _setActiveTab={setActiveTab} ref={searchModuleRef}/>
                </div>
                {!isSearching &&
                    <div className={styles.favorites_back}>
                        <h2 className={styles.title}>Избранные {favoritesList[activeTab]}</h2>
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
                                                     onClick={() => navigate("/group/" + group.id + '?u=' + (group.university === undefined ? 'dstu' : group.university))}>
                                                    <img className={styles.crown} src={CrownIcon}/>
                                                    <div className={styles.inner_cont}>
                                                        <div className={styles.name}>{group.name}</div>
                                                        <div className={styles.actions}></div>
                                                        <div className={styles.faculty}>{group?.faculty}</div>
                                                        <div className={styles.university}>
                                                            {group.university && universities[group.university]}
                                                        </div>
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
                }

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