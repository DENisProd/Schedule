import {useNavigate} from "react-router-dom";
import React from "react";
import {checkGroups} from "../../../utils/localStorageHelpers";

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
                    {groupsList && groupsList.length>0 ? groupsList.slice(0, 100).map(group =>
                        <tr key={group.groupID + group.name} onClick={() => {
                            let _group

                            switch (university) {
                                case 'dstu':
                                    _group = {
                                        id: group.groupID,
                                        name: group.name,
                                        university: 'dstu',
                                        faculty: group.faculty
                                }
                                    break
                                case 'rsue':
                                    _group = {
                                        id: group.name,
                                        name: group.name,
                                        university: 'rsue',
                                        faculty: group.faculty
                                    }
                                    break
                            }

                            localStorage.setItem("groupId", JSON.stringify(_group))
                            let searchList = JSON.parse(localStorage.getItem("searchList"))
                            if (!searchList) searchList = []
                            searchList.push(_group)
                            localStorage.setItem("searchList", JSON.stringify(searchList))
                            // const myGroup = localStorage.getItem('my-group')
                            const myGroup = checkGroups("my-group")
                            if (!myGroup) {
                                const fav = [_group]
                                localStorage.setItem('favorites', JSON.stringify(fav))
                                localStorage.setItem("my-group", JSON.stringify(_group));
                            }
                            navigate('/group/' + _group.id + '?u=' + university)
                        }
                        }>
                            {/*<td>{group.groupID}</td>*/}
                            <td>{group.name}</td>
                            <td>{group.level}</td>
                            <td>{group.faculty}</td>
                        </tr>
                    )
                        :
                        <h3>Ничего не найдено</h3>
                    }
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
                    {teachersList && teachersList.length>0 ? teachersList?.slice(0, 100).map(teachers =>
                        <tr key={teachers.id}
                            onClick={() => {
                                navigate('/teacher/' + teachers.id)
                            }
                            }>
                            <td>{teachers.name}</td>
                        </tr>
                    )
                        :
                        <h3>Ничего не найдено</h3>
                    }
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
                    {roomsList && roomsList.length > 0 ? roomsList.slice(0, 100).map(room =>
                            <tr onClick={() => {
                                navigate('/room/' + room.id)
                            }
                            }
                                key={room.id}>
                                <td>{room.name}</td>
                            </tr>
                        // <tr>{teacher.name}</tr>
                    )
                    :
                    <h3>Ничего не найдено</h3>
                    }
                    </tbody>
                </table>
            )
        }
        default:
            break
    }
}

export default GetTable