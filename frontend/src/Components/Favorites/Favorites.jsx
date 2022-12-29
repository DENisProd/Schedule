import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Favorites() {
  const navigate = useNavigate();

  const [groupsList, setGroupList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [value, setValue] = useState("");

  let filteredGroups = []

  useEffect(() => {
    //const groups = [{ facul: "Маг Соц", id: 47830, name: "AMITS11" }];

    //localStorage.setItem("favorites", JSON.stringify(groups));

    const data = JSON.parse(localStorage.getItem("favorites"));
    console.log(data);
    setGroupList(data);
    setIsLoaded(true);
  }, []);

  window.addEventListener("storage", (event) => {
    console.log(event);
  });

  return (
    <div className="favorites-main-container">
      <div className="favorites-container">
        {isLoaded ? (
          <>
            <h2 className="title-h2">Список избранных групп</h2>
            {groupsList ?
            <>

            
                {groupsList.map((group) => (
                  <div
                    className="favorite-tile"
                    key={group.id}
                    onClick={() => navigate("/group/" + group.id)}
                  >
                    {/*<td>{group.id}</td>*/}
                    {group.name}
                  </div>
                ))}
                </>
                :
                <h5>
                    Вы ещё не добавили группы в избранное
                </h5>
}
          </>
        ) : (
          <h1>Загрузка</h1>
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
  );
}
