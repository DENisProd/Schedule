import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";

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
    }, []);

    const loadFavorites = () => {
        const data = JSON.parse(localStorage.getItem("favorites"));
        setGroupList(data);
        getMyGroup()
        setIsLoaded(true);
    }

    window.addEventListener("storage", (event) => {
        //console.log(event);
    });

    const getMyGroup = () => {
        const myGroupFromStorage = localStorage.getItem("my-group");
        if (myGroupFromStorage) setIsMyGroup(Number(myGroupFromStorage));
    };

    const chooseButtonHandler = (state) => {
        setIsGroupChoose(state);
    };

    const chooseHandler = (event) => {
        localStorage.setItem("my-group", event.target.name);
        setIsGroupChoose(false)
        getMyGroup()
    };

    const removeFavorite = () => {
        const data = JSON.parse(localStorage.getItem("favorites"))
        let groupFromStorage = data
        groupFromStorage.map(gr => {
            Object.keys(gr).forEach(gr => console.log(gr))
        })
        console.log(data)
        loadFavorites()
    }

    return (
        <>
            <div className="favorites-main-container">
                <div className="favorites-container">
                    {isLoaded ? (
                        <>
                            <h6>Версия веб-приложения 0.72</h6>
                            <h2 className="title-h2">Список избранных групп</h2>
                            {groupsList ? (
                                <>
                                    {groupsList.map((group) => (
                                        <>
                                            {isGroupChoose ? (
                                                <div
                                                    className="favorite-tile"
                                                    key={group.id}
                                                >
                                                    {/*<td>{group.id}</td>*/}
                                                    {myGroup===group.id && "Моя группа - "}

                                                    {group.name}
                                                    <input
                                                        type="checkbox"
                                                        name={group.id}
                                                        onChange={(e) =>
                                                            chooseHandler(e)
                                                        }
                                                    />

                                                    <button name={'btn'+group.id} onClick={() => removeFavorite(group.id)}>X</button>
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
                    <button onClick={() => chooseButtonHandler(true)}>
                        Выбрать мою группу
                    </button>
                )}
            </div>
        </>
    );
}
