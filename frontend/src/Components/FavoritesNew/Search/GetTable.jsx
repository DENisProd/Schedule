import {useNavigate} from "react-router-dom";
import React from "react";

const GetTable = ({tab, groupsList, teachersList, roomsList, university}) => {
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
                    {groupsList?.slice(0, 100).map(group =>
                        <tr key={group.groupID + Date.now() + group.name} onClick={() => {
                            let _group

                            switch (university) {
                                case 'dstu':
                                    _group = group
                                    break
                                case 'rsue':
                                    _group = {
                                        groupID: group.name,
                                        name: group.name
                                    }
                            }

                            localStorage.setItem("groupId", _group.groupID)
                            let searchList = JSON.parse(localStorage.getItem("searchList"))
                            if (!searchList) searchList = []
                            searchList.push(_group.name)
                            localStorage.setItem("searchList", JSON.stringify(searchList))
                            const myGroup = localStorage.getItem('my-group')
                            if (!myGroup) {
                                const fav = [{
                                    name: _group.name,
                                    id: _group.groupID
                                }]
                                localStorage.setItem('favorites', JSON.stringify(fav))
                                localStorage.setItem("my-group", _group.groupID);
                            }

                            navigate('/group/' + _group.groupID + '?u=' + university)
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
                    {teachersList && teachersList.length>0 && teachersList?.slice(0, 100).map(teachers =>
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
                    {roomsList && roomsList.length > 0 && roomsList.slice(0, 100).map(room =>
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