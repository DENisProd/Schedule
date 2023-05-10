import styles from "./view-header-new.module.scss"
import dayjs from "dayjs";
import {month2} from "../../../utils/dateUtils";
import cn from "classnames";
import {useContext, useEffect, useState} from "react";
import {SettingsContext} from "../../../providers/SettingsProvider";

const daysOfWeek = [
    "пн",
    "вт",
    "ср",
    "чт",
    "пт",
    "сб",
    "вс",
]

function ViewHeaderNew({info, week, prev, next, lookAt, scrollTo, addToCompare, university}) {

    const [holidays, setHolidays] = useState([])
    const [favorite, setFavorite] = useState(false)
    const [inCompareList, setInCompareList] = useState(false)
    const {settings, setSettings} = useContext(SettingsContext)

    const getMonth = (day) => {
        const date = dayjs(day).get('month')
        return month2[date]
    }

    useEffect(() => {
        checkFavorites()
        setHolidays([])
        if (info.name) {
            Object.keys(info.sked).map(day => {
                if (info.sked[day].length === 0) setHolidays(prevState => [...prevState, day])
            })
        }
    }, [info])

    const checkFavorites = () => {
        setFavorite(false);
        const favoritesGroups = JSON.parse(localStorage.getItem("favorites"));
        if (favoritesGroups) {
            favoritesGroups.forEach((favorites) => {
                if (favorites.id === info.id) {
                    setFavorite(true);
                    return
                }
            });
        }
    };

    const addToFavorites = () => {
        let favoritesGroups = JSON.parse(
            localStorage.getItem("favorites")
        );

        if (favorite) {
            if (favoritesGroups.length > 0) {
                let myArray = favoritesGroups.filter(
                    function (obj) {
                        return (obj.id !== info.id);
                    });
                localStorage.setItem("favorites", JSON.stringify(myArray));
            }
        } else {
            if (favoritesGroups === null) favoritesGroups = [];
            favoritesGroups.push({
                name: info.name,
                id: info.id,
                faculty: info?.faculty,
                university: university
            })
            let favoritesFiltered = favoritesGroups.filter(gr => gr.hasOwnProperty('name') === true)
            localStorage.removeItem("favorites");
            localStorage.setItem("favorites", JSON.stringify(favoritesFiltered));
        }

        checkFavorites()
        // props.checkFavorites();
    }

    const dateClick = (date) => {
        scrollTo(date)
    }

    return (
        <div className={cn(styles.container_wrapper, settings?.calDir === "top" && styles.top)}>
            <div className={styles.container}>
                {settings?.calDir === "top" ?
                    <>
                        <div className={styles.title_container}>
                            <div
                                className={cn(styles.icon_button, inCompareList && styles.compare)}
                                onClick={() => addToCompare(info.id, info.name)}>
                                <svg
                                    version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                    width="800px" height="800px" viewBox="0 0 25.361 25.361">
                                    <g>
                                        <path d="M23.86,0H1.5C0.673,0,0,0.671,0,1.5v22.361c0,0.828,0.672,1.5,1.5,1.5h22.36c0.828,0,1.5-0.672,1.5-1.5V1.5
                                    C25.36,0.671,24.688,0,23.86,0z M19.306,14.182h-5.125v5.125c0,0.83-0.672,1.5-1.5,1.5c-0.828,0-1.5-0.67-1.5-1.5v-5.125H6.056
                                    c-0.828,0-1.5-0.67-1.5-1.5c0-0.829,0.672-1.5,1.5-1.5h5.125V6.057c0-0.829,0.672-1.5,1.5-1.5c0.83,0,1.5,0.671,1.5,1.5v5.125
                                    h5.125c0.828,0,1.5,0.671,1.5,1.5C20.806,13.512,20.134,14.182,19.306,14.182z"/>
                                    </g>
                                </svg>
                            </div>
                            <div className={styles.title}>{info.name}</div>
                            <div
                                className={cn(styles.icon_button, favorite && styles.favorite)}
                                onClick={addToFavorites}>
                                <svg width="800px" height="800px" viewBox="-5.5 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m0 2.089v21.912l6.546-6.26 6.545 6.26v-21.912c-.012-1.156-.952-2.089-2.109-2.089-.026 0-.051 0-.077.001h.004-8.726c-.022-.001-.047-.001-.073-.001-1.158 0-2.098.933-2.109 2.088v.001z"/>
                                </svg>
                            </div>
                        </div>
                        <div className={styles.calendar_container}>
                            <button onClick={prev}>{"<"}</button>

                            <div className={styles.calendar_mini}>
                                {week.map((day, index) =>
                                    <div onClick={() => dateClick(day)}
                                        className={cn(lookAt === day && styles.current, holidays.includes(day) && styles.holiday)}>
                                        <p>{day.split('-')[2]}</p>
                                        <p className={styles.day_name}>{daysOfWeek[index]}</p>
                                    </div>
                                )}
                            </div>

                            <button onClick={next}>{">"}</button>
                        </div>
                        <div className={styles.bottom}>
                            <button>{getMonth(week[0])}</button>
                        </div>
                    </>
                    :
                    <>
                        <div className={styles.title_container}>
                            <div
                                className={cn(styles.icon_button, inCompareList && styles.compare)}
                                onClick={addToCompare}>
                                <svg
                                    version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                    width="800px" height="800px" viewBox="0 0 25.361 25.361">
                                    <g>
                                        <path d="M23.86,0H1.5C0.673,0,0,0.671,0,1.5v22.361c0,0.828,0.672,1.5,1.5,1.5h22.36c0.828,0,1.5-0.672,1.5-1.5V1.5
                                    C25.36,0.671,24.688,0,23.86,0z M19.306,14.182h-5.125v5.125c0,0.83-0.672,1.5-1.5,1.5c-0.828,0-1.5-0.67-1.5-1.5v-5.125H6.056
                                    c-0.828,0-1.5-0.67-1.5-1.5c0-0.829,0.672-1.5,1.5-1.5h5.125V6.057c0-0.829,0.672-1.5,1.5-1.5c0.83,0,1.5,0.671,1.5,1.5v5.125
                                    h5.125c0.828,0,1.5,0.671,1.5,1.5C20.806,13.512,20.134,14.182,19.306,14.182z"/>
                                    </g>
                                </svg>
                            </div>
                            <div className={styles.title}>{info.name}</div>
                            <div
                                className={cn(styles.icon_button, favorite && styles.favorite)}>
                                <svg width="800px" height="800px" viewBox="-5.5 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg" onClick={addToFavorites}>>
                                    <path
                                        d="m0 2.089v21.912l6.546-6.26 6.545 6.26v-21.912c-.012-1.156-.952-2.089-2.109-2.089-.026 0-.051 0-.077.001h.004-8.726c-.022-.001-.047-.001-.073-.001-1.158 0-2.098.933-2.109 2.088v.001z"/>
                                </svg>
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            <button>{getMonth(week[0])}</button>
                        </div>
                        <div className={styles.calendar_container}>
                            <button onClick={prev}>{"<"}</button>

                            <div className={styles.calendar_mini}>
                                {week.map((day, index) =>
                                    <div onClick={() => dateClick(day)} className={cn(lookAt === day && styles.current, holidays.includes(day) && styles.holiday)}>
                                        <p>{day.split('-')[2]}</p>
                                        <p className={styles.day_name}>{daysOfWeek[index]}</p>
                                    </div>
                                )}
                            </div>

                            <button onClick={next}>{">"}</button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default ViewHeaderNew