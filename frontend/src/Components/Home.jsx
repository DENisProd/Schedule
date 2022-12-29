import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

const searchList = [
    "группе",
    "преподавателям",
    "аудиториям"
]

const titleList = [
    "групп",
    "преподавателей",
    "аудиторий"
]

export default function Home() {

    const navigate = useNavigate()

    const [groupsList, setGroupList] = useState([])
    const [teachersList, setTeachersList] = useState([])
    const [roomsList, setRoomsList] = useState([])

    const [isLoaded, setIsLoaded] = useState(false)

    const [tab, setTab] = useState(1)

    const [value, setValue] = useState('')

    const filteredGroups = groupsList.filter(group => {
        return group.name.toLowerCase().includes(value.toLowerCase())
    })

    const filteredTeachers = teachersList.filter(teacher => {
        return teacher?.name?.toLowerCase().includes(value.toLowerCase())
    })

    const filteredRooms = roomsList.filter(room => {
        return room?.name?.toLowerCase().includes(value.toLowerCase())
    })

    useEffect(() => {
        // const savedGroupId = localStorage.getItem("groupId")
        //
        // if (savedGroupId)
        //     navigate('/group/' + Number.parseInt(savedGroupId))


    }, [])

    useEffect(() => {
        setIsLoaded(false)
        switch (tab) {
            case 1:
                if (groupsList.length === 0) {
                    axios("https://edu.donstu.ru/api/raspGrouplist?year=2022-2023").then(res => {
                        setGroupList(res.data.data)
                        setIsLoaded(true)
                    })
                } else {
                    setIsLoaded(true)
                }
                break
            case 2:
                if (teachersList.length === 0) {
                    axios("https://edu.donstu.ru/api/raspTeacherlist?year=2022-2023").then(res => {
                        setTeachersList(res.data.data)
                        console.log(res.data.data[2].name)
                        setIsLoaded(true)
                    })
                } else {
                    setIsLoaded(true)
                }
                break
            case 3:
                if (roomsList.length===0) {
                    axios("https://edu.donstu.ru/api/raspAudlist?year=2022-2023").then(res => {
                        setRoomsList(res.data.data)
                        setIsLoaded(true)
                    })
                } else {
                    setIsLoaded(true)
                }
                break
        }
    }, [tab])

    const getTable = () => {
        switch (tab) {
            case 1:
                return (
                    <table>
                        <thead>
                        {/*<th>ID</th>*/}
                        <th>Группа</th>
                        <th>Курс</th>
                        <th>Факультет</th>
                        {/*<th>Факультет ID</th>*/}
                        </thead>

                        <tbody>
                        {filteredGroups.slice(0,20).map(group =>
                            <tr key={group.id} onClick={() => {
                                localStorage.setItem("groupId", group.id)
                                navigate('/group/' + group.id)}
                            }>
                                {/*<td>{group.id}</td>*/}
                                <td>{group.name}</td>
                                <td>{group.kurs}</td>
                                <td>{group.facul}</td>
                                {/*<td>{group.facultyID}</td>*/}
                            </tr>
                        )}
                        </tbody>
                    </table>
                )
                break
            case 2:
                return (
                    <table>
                        <thead>
                        <th>Фамилия Имя Отчетво</th>
                        </thead>
                        <tbody>
                        {filteredTeachers.slice(0,20).map(teachers =>
                                <tr>
                                    <td>{teachers.name}</td>
                                </tr>
                        )}
                        </tbody>
                    </table>
                )
                break
            case 3:
                return (
                    <table>
                        <thead>
                        <th>Аудитория</th>
                        </thead>
                        <tbody>
                        {filteredRooms.slice(0,20).map(room =>
                                <tr>
                                    <td>{room.name}</td>
                                </tr>
                            // <tr>{teacher.name}</tr>
                        )}
                        </tbody>
                    </table>
                )
                break
        }
    }

    return (
        <div className={"home-container"}>
            <h2 className="title-h2">Список {titleList[tab-1]}</h2>
            <div className={"search-container"}>
                <div className={"search-tabs"}>
                    <button className={tab === 1 ? "active" : ""} onClick={() => setTab(1)}>По группе</button>
                    <button className={tab === 2 ? "active" : ""} onClick={() => setTab(2)}>По преподавателям</button>
                    <button className={tab === 3 ? "active" : ""} onClick={() => setTab(3)}>По аудиториям</button>
                </div>
                <input autoFocus placeholder={"Поиск по " + searchList[tab - 1]} className={"search-field"}
                       onChange={(e) => setValue(e.target.value)} value={value}/>
            </div>

            {isLoaded ?
                <>
                    {getTable()}
                </>
                :
                <h1>Загрузка...</h1>
            }
        </div>
    )
}