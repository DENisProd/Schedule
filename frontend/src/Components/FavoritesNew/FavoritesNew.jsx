import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

import styles from "./favorites.module.scss"
import Home from "../Home";
import TabBar from "../UIKit/TabBar/TabBar";
import SearchModule from "./Search/SearchModule";

const favoritesList = [
    "группы",
    "преподаватели",
    "аудитории"
]

const FavoritesNew = () => {
    const navigate = useNavigate();

    const [groupsList, setGroupList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isGroupChoose, setIsGroupChoose] = useState(false);
    const [myGroup, setIsMyGroup] = useState(null);

    const [isSearching, setIsSearching] = useState(false)
    const [activeTab, setActiveTab] = useState(0)

    const [value, setValue] = useState("");

    let filteredGroups = [];

    useEffect(() => {
        loadFavorites()
    }, [])

    const loadFavorites = () => {
        let data = JSON.parse(localStorage.getItem("favorites"))
        if (data) {
            let filtered = data.filter(gr => gr.hasOwnProperty('name')===true)
            setGroupList(filtered)
            getMyGroup()
        }
        setIsLoaded(true)
    }

    window.addEventListener("storage", (event) => {
        //console.log(event);
    });

    const getMyGroup = () => {
        const myGroupFromStorage = localStorage.getItem("my-group");
        if (myGroupFromStorage) setIsMyGroup(Number(myGroupFromStorage));
    };

    const chooseButtonHandler = (state) => {
        if (groupsList.length>0)
            setIsGroupChoose(state)
    };

    const chooseHandler = (event) => {
        localStorage.setItem("my-group", event.target.name);
        setIsGroupChoose(false)
        getMyGroup()
    };

    const removeFavorite = (id) => {
        const data = JSON.parse(localStorage.getItem("favorites"))
        let groupFromStorage = data
        groupFromStorage = groupFromStorage.filter(gr => gr.id !== id)
        localStorage.setItem("favorites", JSON.stringify(groupFromStorage))
        loadFavorites()
        setIsGroupChoose(false)
    }

    return (
        <div className={styles.favorites_screen}>
            <div className={styles.search_container}>
                <SearchModule _setIsSearching={setIsSearching} _setActiveTab={setActiveTab}/>
            </div>
            {!isSearching &&
                <>
                    <h2 className={styles.title}>Избранные {favoritesList[activeTab]}</h2>
                    <div className={styles.favorites_container}>
                        {groupsList.length>0 ? (
                            <>
                                {groupsList.map((group) => (
                                    <>
                                        {isGroupChoose ? (
                                            <div className={styles.tile} key={group.id}>
                                                {/*<td>{group.id}</td>*/}
                                                {myGroup===group.id && "Моя группа - "}


                                                <button name={'btn'+group.id} className={styles.btn} onClick={() => removeFavorite(group.id)}>X</button>
                                                <div>{group.name}</div>
                                                <input
                                                    type="checkbox"
                                                    className={styles.btn}
                                                    name={group.id}
                                                    onChange={(e) =>
                                                        chooseHandler(e)
                                                    }
                                                />

                                            </div>
                                        ) : (
                                            <div
                                                className={styles.tile}
                                                key={group.id}
                                                onClick={() =>
                                                    navigate(
                                                        "/group/" + group.id
                                                    )
                                                }
                                            >
                                                {/*<td>{group.id}</td>*/}
                                                {myGroup===group.id && "Моя группа - "}

                                                <div>{group.name}</div>
                                            </div>
                                        )}
                                    </>
                                ))}
                            </>
                        ) : (
                            <h5>Вы ещё не добавили группы в избранное</h5>
                        )}
                    </div>
                </>
            }

            <div className={styles.bottom_container}>
                {isGroupChoose ? (
                    <button onClick={() => chooseButtonHandler(false)}>
                        Отмена
                    </button>
                ) : (
                    <button onClick={() => chooseButtonHandler(true)}>
                        Выбрать мою группу
                    </button>
                )}
            </div>

        </div>
    )
}

export default FavoritesNew