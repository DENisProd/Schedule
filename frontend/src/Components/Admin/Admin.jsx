
import {useCallback, useEffect, useState} from "react"
import axios from "axios"
import User from "./User"
import UAParser from "ua-parser-js"

const get_url = "https://schedule.darksecrets.ru/api/all/"

export default function Admin() {
    const [password, setPassword] = useState('')
    const [isDataLoaded, setIsDataLoaded] = useState(false)
    const [isFreqCalculated, setIsFreqCalculated] = useState(false)
    const [data, setData] = useState([])


    const [searchUnion, setSearchUnion] = useState([])
    const [freqSearchUnion, setFreqSearchUnion] = useState([])
    const [favoritesUnion, setFavoritesUnion] = useState([])
    const [freqFavoritesUnion, setFreqFavoritesUnion] = useState([])

    const [eniqueUsers, setEniqueUsers] = useState(0)
    const [uniqueData, setUniqueData] = useState([])


    const enter = () => {
        axios.post(get_url, {pwd: password}).then(res => {
            if (res.data.success === 'ok') {
                setData(res.data?.data?.reverse())
                console.log(res?.data?.data.length)
                setIsDataLoaded(true)
            } else {
                alert("Неправильный пароль")

            }


        })
    }

    const frequencies = arr =>
        Array.isArray(arr)
            ? arr.reduce((aсс, v) => {
                aсс[v] = aсс[v] ? aсс[v] + 1 : 1;
                return aсс;
            }, {})
            : null;

    const getTop5 = (arr) => Object.entries(arr).slice(0,10).map(entry => entry[1]);

    const topArrToLi = (arr) => {
        console.log(arr)
        let answer = []
        getTop5(arr).map(gr => answer.push(<li>{gr[0]} : {gr[1]}</li>))
        return answer
    }

    const sortUnion = (union) => {
        const freq = frequencies(union)
        let sortableSearch = [];
        for (let group in freq) {
            sortableSearch.push([group, freq[group]]);
        }
        sortableSearch.sort(function(a, b) {
            return a[1] - b[1];
        }).reverse()
        return sortableSearch
    }

    const createUnion = useCallback(() => {
        setIsFreqCalculated(false)
        data.map(user => {
            if (user?.searchedGroups) user?.searchedGroups.forEach(sgr => setSearchUnion(prevState => [...prevState, sgr]))
            if (user?.favoriteGroups) user?.favoriteGroups.forEach(fgr => setFavoritesUnion(prevState => [...prevState, fgr]))
        })

        setFreqSearchUnion(sortUnion(searchUnion))
        setFreqFavoritesUnion(sortUnion(favoritesUnion))
        setIsFreqCalculated(true)
    }, [data])

    // helpers start
    const compose = (fn1, fn2) => x => fn1(fn2(x))

    const reduceByProp = prop => a =>
        a.reduce((acc, curr) => ({ ...acc, [curr[prop]]: curr }), {})

    const uniqByProp = prop => compose(Object.values, reduceByProp(prop))
    // helpers end

    // logic start
    const uniqByUserAgent = uniqByProp(setUniqueData,'userAgent')
    const getUniqAndPrint = compose(uniqByUserAgent)

    useEffect(() => {
        setEniqueUsers(0)
        setSearchUnion([])
        setFavoritesUnion([])
        const dat = data.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.userAgent === value.userAgent
                ))
        )
        let topVisits = dat.sort((a,b) => a.enterCount > b.enterCount ? 1 : -1).reverse()
        const table = {};
        const res = data.filter(({enterCount}) =>(!table[enterCount] && (table[enterCount] = 1)));
        console.log(res)
        let devices = {
        }
        res.map(user => {
            let parser = new UAParser(user.userAgent)
            let parserResults = parser.getResult()
            if (devices[`${parserResults.os.name}`])
                devices[`${parserResults.os.name}`] = devices[parserResults.os.name]+1
            else
                devices[`${parserResults.os.name}`] = 1
        })
        console.log(devices)

        let filteredTopVisits = topVisits.filter(value =>  value.enterCount > 20)
        console.log(filteredTopVisits)
        //setData(filteredTopVisits)
        setEniqueUsers(dat.length)
        createUnion()
        //getUniqAndPrint(data);

// logic end

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
                    <h4>Количество групп, которые искали: {searchUnion.length}</h4>
                    {isFreqCalculated && <div><h5>Частота Найденных</h5><ul>{topArrToLi(freqSearchUnion)}</ul></div>}
                    <h4>Количество групп, которые добавили в избранное: {favoritesUnion.length}</h4>
                    {isFreqCalculated && <div><h5>Частота Добавленных в избранное</h5><ul>{topArrToLi(freqFavoritesUnion)}</ul></div>}
                    <table>
                        <thead>
                        <tr>
                            {/*<td>ID</td>*/}
                            <td>User Agent</td>
                            <td>IP</td>
                            <td>searchedGroups</td>
                            <td>favoriteGroups</td>
                            <td>enterCount</td>
                            <td>group</td>
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