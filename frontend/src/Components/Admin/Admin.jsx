
import {useEffect, useState} from "react"
import axios from "axios"
import User from "./User"

const get_url = "https://schedule.darksecrets.ru/api/all/"

export default function Admin() {
    const [password, setPassword] = useState('')
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [data, setData] = useState([])

    const [eniqueUsers, setEniqueUsers] = useState(0)
    const [eniqueData, setEniqueData] = useState([])


    const enter = () => {
        axios.post(get_url, {pwd: password}).then(res => {
            if (res.data.success === 'ok') {
                setData(res.data?.data?.reverse())
                setIsDataLoaded(true)
            } else {
                alert("Неправильный пароль")
            }


        })
    }



    useEffect(() => {
        const dat = data.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.userAgent === value.userAgent
                ))
        )
        setEniqueUsers(dat.length)
    }, [isDataLoaded===true])

    return (
        <div>
            <h1>Admin</h1>
            <p>Введите пароль</p>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password"/>
            <button onClick={enter}>Вход</button>
            {isDataLoaded &&

                <div className="tiles-main-container" id={"admin_container"}>
                    <h4>Уникальных пользователей: {eniqueUsers}</h4>
                    <table>
                        <thead>
                        <tr>
                            {/*<td>ID</td>*/}
                            <td>User Agent</td>
                            <td>IP</td>
                            <td>searchedGroups</td>
                            <td>favoriteGroups</td>
                            <td>enterCount</td>
                            <td>created</td>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((user) => <User user={user}/>)}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}