import CalendarComponent from "../CalendarComponent";
//import {Typography} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment/moment";
import SwipebleViewTile from "../SwipebleViewTile/SwipebleViewTile";
import Loader from "../Loader/Loader";

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

const requests = {
    group: "https://edu.donstu.ru/api/Rasp?idGroup=",
    room: "https://edu.donstu.ru/api/Rasp?idAudLine=",
    teachers: "https://edu.donstu.ru/api/Rasp?idTeacher=",
};

// export default function ViewRoom({ isTeachers, isRoom }) {
//     const { roomId } = useParams();
//     const [rasp, setRasp] = useState([]);
//     const [info, setInfo] = useState({});
//     const [groupedRasp, setGroupedRasp] = useState({});
//     const [isLoaded, setIsLoaded] = useState(false);
//
//     const [date, setDate] = useState(new Date());
//     const todayDate = date.getDate();
//
//     const normalize = (value) => {
//         if (value < 10) return "0" + value;
//         else return value;
//     };
//
//     const scheduleProccessing = (res) => {
//         let obj = {};
//         let rasp1 = res.data.data.rasp;
//         for (let i = 0; i < rasp1.length; i++) {
//             const raspDate = rasp1[i]["дата"].split("T");
//             if (obj[raspDate[0]]?.length > 0) {
//                 if (
//                     rasp1[i]["номерЗанятия"] === rasp1[i - 1]["номерЗанятия"] &&
//                     rasp1[i - 1]["дата"].split("T")[0] === raspDate[0]
//                 ) {
//                     obj[raspDate[0]][obj[raspDate[0]].length - 1].push({
//                         ...rasp1[i],
//                         isPodgr: true,
//                     });
//                 } else {
//                     obj[raspDate[0]].push([
//                         {
//                             ...rasp1[i],
//                             isPodgr: false,
//                         },
//                     ]);
//                 }
//             } else {
//                 obj[raspDate[0]] = [];
//                 obj[raspDate[0]].push([
//                     {
//                         ...rasp1[i],
//                         isPodgr: false,
//                     },
//                 ]);
//             }
//         }
//
//         return obj;
//     };
//
//     const getRequestUrl = () => {
//         let url = "";
//
//         if (isTeachers) url = requests.teachers;
//         if (isRoom) url = requests.room;
//
//         return url;
//     };
//
//     const updateSchedule = (currentDate) => {
//         setIsLoaded(false);
//
//         axios
//             .get(
//                 getRequestUrl() +
//                     roomId +
//                     `&sdate=${currentDate.getFullYear()}-${normalize(
//                         currentDate.getMonth() + 1
//                     )}-${normalize(currentDate.getDate())}`
//             )
//             .then((res) => {
//                 setRasp(res.data.data.rasp);
//                 setInfo(res.data.data.info);
//
//                 let obj = scheduleProccessing(res);
//
//                 setGroupedRasp(obj);
//                 setIsLoaded(true);
//             });
//     };
//
//     useEffect(() => {
//         updateSchedule(new Date());
//     }, []);
//
//     useEffect(() => {
//         const doc = document.getElementById(todayDate);
//
//         document.title = info.group?.name + " - Расписание MySecrets";
//
//         if (doc) doc.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, [isLoaded === true]);
//
//     return (
//         <div className="main-container">
//             <div className="tiles-container">
//                 <header>
//                     <div style={{ padding: "0 1.5em" }}></div>
//                     {isTeachers && (
//                         <h2 className="title-h2">
//                             Преподаватель {isLoaded && info.prepod.name}
//                         </h2>
//                     )}
//                     {isRoom && (
//                         <h2 className="title-h2">
//                             Аудитория {isLoaded && info.aud.name}
//                         </h2>
//                     )}
//                 </header>
//                 <CalendarComponent updateSchedule={updateSchedule} />
//                 {isLoaded ? (
//                     <>
//                         {Object.keys(groupedRasp).length > 0 ? (
//                             <>
//                                 {Object.keys(groupedRasp).map((gr) => (
//                                     <div
//                                         id={Number(gr.split("-")[2]).toString()}
//                                     >
//                                         <h2
//                                             className={
//                                                 gr.split("-")[2] ===
//                                                 todayDate.toString()
//                                                     ? "today"
//                                                     : "day"
//                                             }
//                                         >
//                                             {Number(gr.split("-")[2])}{" "}
//                                             {
//                                                 month[
//                                                     Number(gr.split("-")[1]) - 1
//                                                 ]
//                                             }{" "}
//                                             {gr.split("-")[2] ===
//                                                 todayDate.toString() &&
//                                                 " (сегодня)"}
//                                         </h2>
//                                         {groupedRasp[gr].map((subjects) => (
//                                             // <div>
//                                             // {/* {console.log(subject)} */}
//                                             // ava
//                                             // </div>
//                                             <SwipebleViewTile
//                                                 isRoom={isRoom}
//                                                 isTeachers={isTeachers}
//                                                 subjects={subjects}
//                                             />
//                                         ))}
//                                     </div>
//                                 ))}
//                             </>
//                         ) : (
//                             <h3>На данную неделю нет расписания</h3>
//                         )}
//                     </>
//                 ) : (
//                     <h1>Загрузка</h1>
//                 )}
//             </div>
//         </div>
//     );
// }
