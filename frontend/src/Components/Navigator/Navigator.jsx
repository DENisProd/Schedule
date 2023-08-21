import styles from "./navigator.module.scss"
import FiveFloor10 from "./Buildings/10/FiveFloor10";
import ThirdFloor10 from "./Buildings/10/ThirdFloor10";
import {useEffect, useRef, useState} from "react";
import {TaskSearch} from "../Tasks/TasksHeader/TaskSearch";
import {MapComponent} from "./MapComponent";
import {MainTerritory} from "./Buildings/MainTerritory";
import {FourthFloor10} from "./Buildings/10/FourthFloor10";

export default function Navigator() {
    const [value, setValue] = useState('')
    const [build, setBuild] = useState(1)
    const [floor, setFloor] = useState(1)
    const [lastElement, setLastElement] = useState('')
    const [map, setMap] = useState(null)
    const [scrollToElementId, setScrollToElementId] = useState(null);
    const mapContainerRef = useRef(null);

    const elementRef = useRef(null);

    const search = () => {
        if (lastElement) {
            document.getElementById(lastElement)?.classList.remove(styles.selected)
        }

        const _build = Number.parseInt(value.split('-')[0])
        const _floor = Number.parseInt(value[3])

        setMap(getMapComponent(_build, _floor))
        setBuild(_build)
        setFloor(_floor)
        const element = document.getElementById(value)
        if (element) {
            setTimeout(() => {
                element.classList.add(styles.selected)
                const elementRect = element.getBoundingClientRect();
                const viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                const offsetHorizontal = (viewWidth - elementRect.width) / 2;
                const offsetVertical = (viewHeight - elementRect.height) / 2;
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center",
                    inlineTo: offsetHorizontal,
                    blockTo: offsetVertical
                });
                setLastElement(element.id)
            }, 300)
        }
    }

    const handleButtonClick = () => {
        scrollToCenter(); // Вызов scrollToCenter() в ответ на нажатие кнопки или другое событие
    };

    const scrollToCenter = () => {
        if (mapContainerRef.current) {
            const container = mapContainerRef.current.querySelector('svg');
            const containerHeight = container.clientHeight;
            const containerWidth = container.clientWidth;
            const scrollHeight = container.scrollHeight;
            const scrollWidth = container.scrollWidth;
            const offsetTop = scrollHeight / 2 - containerHeight / 2;
            const offsetLeft = scrollWidth / 2 - containerWidth / 2;

            setTimeout(() => {
                container.scrollTo({
                    top: offsetTop,
                    left: offsetLeft,
                    behavior: 'smooth',
                });
            }, 200);
        }
    };

    const getMapComponent = (build, floor) => {
        if (build === 10) {
            if (floor === 3) return <ThirdFloor10 handleButtonClick={handleButtonClick}/>
            else if (floor === 4) return <FourthFloor10 handleButtonClick={handleButtonClick}/>
            else if (floor === 5) return <FiveFloor10 handleButtonClick={handleButtonClick}/>
            else return <MainTerritory handleButtonClick={handleButtonClick}/>
        }
    }

    useEffect(() => {
        document.getElementById('root').classList.remove('scroll-blocked')
    }, [])

    return (
        <div className={styles.main_container}>
            <div className={styles.navigator_header}>
                <h2>Карта корпусов</h2>
                <TaskSearch setParentText={setValue} placeholder={"Введите аудиторию..."} enter={search}/>
            </div>

            <div className={styles.container} ref={mapContainerRef}>
                {/*{build === 10 &&*/}
                {/*    <>*/}
                {/*        {floor === 3 && <ThirdFloor10/>}*/}
                {/*        {floor === 5 && <FiveFloor10/>}*/}
                {/*    </>*/}
                {/*}*/}
                <MapComponent map={map}/>


            </div>
        </div>
    )
}