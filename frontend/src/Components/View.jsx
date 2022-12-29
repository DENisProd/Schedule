import CalendarComponent from "./CalendarComponent";
//import {Typography} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment/moment";

//const {Title} = Typography

const types = [
  { name: "Военная кафедра", color: "#fff" },
  { name: "лаб", color: "#E4E9FF" },
  { name: "лек", color: "#DBFFE7" },
  { name: "пр.", color: "#FFE2E7" },
  { name: "фв", color: "#FFF8E1" },
  { name: "экз", color: "#AADAFF" },
  { name: "зач", color: "#F2BAA6" },
  { name: "зчО", color: "#F2BAA6" },
];

const month = [
  "Января",
  "Февраля",
  "Марта",
  "Апреля",
  "Мая",
  "Июня",
  "Июля",
  "Августа",
  "Сентября",
  "Октября",
  "Ноября",
  "Декабря",
];

const dayOfWeek = [];

export default function View() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  //const id = 44464

  const [rasp, setRasp] = useState([]);
  const [info, setInfo] = useState({});
  const [groupedRasp, setGroupedRasp] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const [date, setDate] = useState(new Date());
  const todayDate = date.getDate();
  const [inFavorites, setInFavorites] = useState(false);

  const normalize = (value) => {
    if (value < 10) return "0" + value;
    else return value;
  };

  const getCurrentWeek = () => {
    let curr = new Date();
    let week = [];

    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i + 1;
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
      week.push(day);
    }
    return week;
  };

  const getNextWeek = () => {
    let date = new Date(),
      targetDay = 1, // пятница, начиная с вс=0
      targetDate = new Date(),
      delta = targetDay - date.getDay();
    if (delta >= 0) {
      targetDate.setDate(date.getDate() + delta);
    } else {
      targetDate.setDate(date.getDate() + 7 + delta);
    }
  };

  const updateSchedule = (currentDate) => {
    setIsLoaded(false);

    axios
      .get(
        "https://edu.donstu.ru/api/Rasp?idGroup=" +
          groupId +
          `&sdate=${currentDate.getFullYear()}-${normalize(
            currentDate.getMonth() + 1
          )}-${normalize(currentDate.getDate())}`
      )
      .then((res) => {
        setRasp(res.data.data.rasp);
        setInfo(res.data.data.info);

        let obj = {};
        let rasp1 = res.data.data.rasp;
        for (let i = 0; i < rasp1.length; i++) {
          if (obj[rasp1[i]["дата"].split("T")[0]]?.length > 0) {
            if (
              rasp1[i]["номерЗанятия"] === rasp1[i - 1]["номерЗанятия"] &&
              rasp1[i - 1]["дата"].split("T")[0] ===
                rasp1[i]["дата"].split("T")[0]
            ) {
              obj[rasp1[i]["дата"].split("T")[0]].push({
                ...rasp1[i],
                isPodgr: true,
              });
            } else {
              obj[rasp1[i]["дата"].split("T")[0]].push({
                ...rasp1[i],
                isPodgr: false,
              });
            }
          } else {
            obj[rasp1[i]["дата"].split("T")[0]] = [];
            obj[rasp1[i]["дата"].split("T")[0]].push({
              ...rasp1[i],
              isPodgr: false,
            });
          }
        }

        setGroupedRasp(obj);
        setIsLoaded(true);
      });
  };

  const getStyle = (name) => {
    for (let i = 0; i < types.length; i++)
      if (name.split(" ")[0].includes(types[i].name)) return types[i].color;
    return "";
  };

  const checkFavorites = () => {
    setInFavorites(false);
    const favoritesGroups = JSON.parse(localStorage.getItem("favorites"));
    console.log(info);
    if (favoritesGroups) {
      favoritesGroups.forEach((favorites) => {
        if (favorites.id === info?.group?.groupID) {
          setInFavorites(true);
          return;
        }
      });
    }
  };

  useEffect(() => {
    console.log(date);

    axios
      .get("https://edu.donstu.ru/api/GetRaspDates?idGroup=" + groupId)
      .then((res) => {
        console.log(res.data);
        const data = res.data.data.dates;
      });

    updateSchedule(new Date());
  }, []);

  let array = [];

  useEffect(() => {
    const doc = document.getElementById(todayDate);

    document.title = info.group?.name + " - Расписание MySecrets";
    checkFavorites();

    if (doc) doc.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isLoaded === true]);

  return (
    <div className="main-container">
      <div className="tiles-container">
        <header>
          <div style={{ padding: "0 1.5em" }}></div>
          <h2 className="title-h2">Группа {isLoaded && info.group.name}</h2>

          {isLoaded && (
            <div
              className={"icon-btn" + (inFavorites ? " favorite" : "")}
              onClick={() => {
                let favoritesGroups = JSON.parse(
                  localStorage.getItem("favorites")
                );

                if (inFavorites) {
                  if (favoritesGroups.length > 0) {
                  let myArray = favoritesGroups.filter(function( obj ) {
                    return obj.id !== info.group.groupID;
                });
                  console.log(myArray);
                  localStorage.setItem(
                    "favorites",
                    JSON.stringify(myArray)
                  );
                  }
                } else {
                  if (favoritesGroups===null) favoritesGroups = []
                  favoritesGroups.push({
                    name: info.group.name,
                    id: info.group.groupID,
                    facul: "",
                  });
                  console.log(favoritesGroups);
                  localStorage.removeItem("favorites");
                  localStorage.setItem(
                    "favorites",
                    JSON.stringify(favoritesGroups)
                  );
                }

                checkFavorites();
              }}
            >
              <svg
                width="800px"
                height="800px"
                viewBox="-5.5 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m0 2.089v21.912l6.546-6.26 6.545 6.26v-21.912c-.012-1.156-.952-2.089-2.109-2.089-.026 0-.051 0-.077.001h.004-8.726c-.022-.001-.047-.001-.073-.001-1.158 0-2.098.933-2.109 2.088v.001z" />
              </svg>
            </div>
          )}
        </header>
        <CalendarComponent updateSchedule={updateSchedule} />
        {isLoaded ? (
          <>
            {Object.keys(groupedRasp).map((gr) => (
              <div id={Number(gr.split("-")[2]).toString()}>
                <h2
                  className={
                    gr.split("-")[2] === todayDate.toString() ? "today" : "day"
                  }
                >
                  {Number(gr.split("-")[2])}{" "}
                  {month[Number(gr.split("-")[1]) - 1]}{" "}
                  {gr.split("-")[2] === todayDate.toString() && " (сегодня)"}
                </h2>
                {groupedRasp[gr].map((subject) => (
                  <div className="subject-tile" key={subject["код"]}>
                    <div
                      className="subject-tile-left"
                      style={{
                        background: subject.isPodgr
                          ? "none"
                          : getStyle(subject["дисциплина"]),
                      }}
                    >
                      {!subject.isPodgr && (
                        <>
                          <h1>{subject["номерЗанятия"]}</h1>
                          <h4 className="time-h">
                            с{" "}
                            <span className="time-span">
                              {subject["начало"]}
                            </span>
                          </h4>
                          <h4 className="time-h">
                            до{" "}
                            <span className="time-span">
                              {subject["конец"]}
                            </span>
                          </h4>
                        </>
                      )}
                    </div>

                    <div className="subject-tile-right">
                      <h3>{subject["дисциплина"]}</h3>
                      {subject?.isPodgr && (
                        <p>
                          <b>Подгруппа</b>
                        </p>
                      )}

                      <p>Аудитория {subject["аудитория"]}</p>
                      <p>{subject["преподаватель"]}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <h1>Загрузка</h1>
        )}
      </div>
    </div>
  );
}
