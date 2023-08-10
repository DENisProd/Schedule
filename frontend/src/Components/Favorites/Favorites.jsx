import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";

import "../../App.css"
import "./favorites.css"

const version = "0.83b2"

export default function Favorites() {
    const navigate = useNavigate();

    const [groupsList, setGroupList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isGroupChoose, setIsGroupChoose] = useState(false);
    const [myGroup, setIsMyGroup] = useState(null);

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

    const wantChooseGroup = () => {
        if (groupsList.length > 0) {
            chooseButtonHandler(true)
        } else {

        }
    }

    return (
        <>
            <div className="favorites-main-container">
                <div className="favorites-container">
                    {isLoaded ? (
                        <>
                            <h6>Версия веб-приложения {version}</h6>
                            <h2 className="title-h2">Список избранных групп</h2>
                            {groupsList.length>0 ? (
                                <>
                                    {groupsList.map((group) => (
                                        <>
                                            {isGroupChoose ? (
                                                <div className="favorite-tile" key={group.id}>
                                                    {/*<td>{group.id}</td>*/}
                                                    {myGroup===group.id && "Моя группа - "}

                                                    <button name={'btn'+group.id} onClick={() => removeFavorite(group.id)}>X</button>
                                                    {group.name}
                                                    <input
                                                        type="checkbox"
                                                        name={group.id}
                                                        onChange={(e) =>
                                                            chooseHandler(e)
                                                        }
                                                    />
                                                    
                                                </div>
                                            ) : (
                                                <div
                                                    className="favorite-tile"
                                                    key={group.id}
                                                    onClick={() =>
                                                        navigate(
                                                            "/group/" + group.id
                                                        )
                                                    }
                                                >
                                                    {/*<td>{group.id}</td>*/}
                                                    {myGroup===group.id && "Моя группа - "}

                                                    {group.name}
                                                </div>
                                            )}
                                        </>
                                    ))}
                                </>
                            ) : (
                                <h5>Вы ещё не добавили группы в избранное</h5>
                            )}
                        </>
                    ) : (
                        <Loader/>
                    )}
                </div>
                <aside>
                    <ul>
                        <li>Моя группа</li>
                        <li>Пока не придумал </li>
                        <li>Мои задачи</li>
                    </ul>
                </aside>
            </div>

            <div className="favorites-bottom-container">
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
        </>
    );
}
