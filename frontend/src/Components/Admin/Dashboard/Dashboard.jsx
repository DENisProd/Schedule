import {useEffect, useState} from "react";
import BarChart from "../Charts/BarChart";

export default function Dashboard({_data}) {
    const [values, setValues] = useState([])
    const [labels, setLabels] = useState([])

    useEffect(() => {
        Object.keys(_data).map(date => {
            setLabels((prevState) => [...prevState, date])
            setValues((prevState) => [...prevState, _data[date]])
        })
    }, [])

    return (
        <div>
            <BarChart data={values} labels={labels}/>
        </div>
    )
}