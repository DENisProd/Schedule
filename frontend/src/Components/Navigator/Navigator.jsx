import styles from "./navigator.module.scss"
import FiveFloor10 from "./Buildings/10/FiveFloor10";
import ThirdFloor10 from "./Buildings/10/ThirdFloor10";
import {useEffect, useState} from "react";

export default function Navigator() {
    const [value, setValue] = useState('')
    const [build, setBuild] = useState(1)
    const [floor, setFloor] = useState(1)
    const [lastElement, setLastElement] = useState('')

    const search = () => {
        if (lastElement) {
            document.getElementById(lastElement)?.classList.remove(styles.selected)
        }
        const _build = Number.parseInt(value.split('-')[0])
        const _floor = Number.parseInt(value[3])
        setBuild(_build)
        setFloor(_floor)
        const element = document.getElementById(value)
        if (element) {
            element.classList.add(styles.selected)
            element.scrollIntoView({behavior: "smooth", block: "center"})
            setLastElement(element.id)
        }
    }

    useEffect(() => {
        document.getElementById('root').classList.remove('scroll-blocked')
    }, [])

    return (
        <div>
            <div className="navigator-header">
                <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Введите аудиторию"/>
                <button onClick={() => search()}>Искать аудиторию</button>
            </div>

            <div className={styles.container}>
                {build === 10 &&
                    <>
                        {floor === 3 && <ThirdFloor10/>}
                        {floor === 5 && <FiveFloor10/>}
                    </>
                }


            </div>
        </div>
    )
}