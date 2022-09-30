import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Home() {

    const navigate = useNavigate()
    const [groupsList, setGroupList] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        axios("https://edu.donstu.ru/api/raspGrouplist?year=2022-2023").then(res => {
            setGroupList(res.data.data)
            setIsLoaded(true)
        })
    }, [])

    return (
        <div>
            {isLoaded ?
                <table width={500} style={{textAlign: "center"}}>
                    <thead>
                    <th>ID</th>
                    <th>Группа</th>
                    <th>Курс</th>
                    <th>Факультет</th>
                    <th>Факультет ID</th>
                    </thead>

                    <tbody>
                    { groupsList.map(group =>
                        <tr key={group.id} onClick={() => navigate('/group/'+group.id)}>
                            <td>{group.id}</td>
                            <td>{group.name}</td>
                            <td>{group.kurs}</td>
                            <td>{group.facul}</td>
                            <td>{group.facultyID}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            :
                <h1>Загрузка...</h1>
            }
        </div>
    )
}