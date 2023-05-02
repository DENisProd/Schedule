import {useNavigate} from "react-router-dom";
import React from "react";

const GetTable = ({tab, groupsList, teachersList, roomsList}) => {
    const navigate = useNavigate()
    switch (tab) {
        case 0: {
            return (
                <table>
                    <thead>
                    <tr>
                        <th>Группа</th>
                        <th>Курс</th>
                        <th>Факультет</th>
                    </tr>
                    </thead>

                    <tbody>
                    {groupsList.slice(0, 100).map(group =>
                        <tr key={group.groupID + Date.now() + group.name} onClick={() => {
                            localStorage.setItem("groupId", group.groupID)
                            let searchList = JSON.parse(localStorage.getItem("searchList"))
                            if (!searchList) searchList = []
                            searchList.push(group.name)
                            localStorage.setItem("searchList", JSON.stringify(searchList))

                            navigate('/group/' + group.groupID)
                        }
                        }>
                            {/*<td>{group.groupID}</td>*/}
                            <td>{group.name}</td>
                            <td>{group.level}</td>
                            <td>{group.faculty}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )
        }
        case 1: {
            return (
                <table>
                    <thead>
                    <tr>
                        <th>Фамилия Имя Отчество</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teachersList.slice(0, 100).map(teachers =>
                        <tr key={teachers.id}
                            onClick={() => {
                                navigate('/teacher/' + teachers.id)
                            }
                            }>
                            <td>{teachers.name}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )
        }
        case 2: {
            return (
                <table>
                    <thead>
                    <tr>
                        <th>Аудитория</th>
                    </tr>
                    </thead>
                    <tbody>
                    {roomsList.slice(0, 100).map(room =>
                            <tr onClick={() => {
                                navigate('/room/' + room.id)
                            }
                            }
                                key={room.id}>
                                <td>{room.name}</td>
                            </tr>
                        // <tr>{teacher.name}</tr>
                    )}
                    </tbody>
                </table>
            )
        }
        default:
            break
    }
}

export default GetTable