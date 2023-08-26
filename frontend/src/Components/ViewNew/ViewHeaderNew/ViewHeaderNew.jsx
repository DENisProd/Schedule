import styles from "./view-header-new.module.scss"
import dayjs from "dayjs";
import {month2} from "../../../utils/dateUtils";
import cn from "classnames";
import {useContext, useEffect, useState} from "react";
import {SettingsContext} from "../../../providers/SettingsProvider";
import {useDispatch, useSelector} from "react-redux";
import {addGroupToCompare} from "../../../store/compareReducer";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const groups = useSelector(state => state.compare)

    const [holidays, setHolidays] = useState([])
    const [favorite, setFavorite] = useState(false)
    const [inCompareList, setInCompareList] = useState(false)
    const {settings, setSettings} = useContext(SettingsContext)

    const getMonth = (day) => {
        const date = dayjs(day).get('month')
        return month2[date]
    }

    useEffect(() => {
        const isFavorite = checkFavorites()
        setFavorite(isFavorite)
        setHolidays([])
        if (info.name) {
            Object.keys(info.sked).map(day => {
                if (info.sked[day].length === 0) setHolidays(prevState => [...prevState, day])
            })
        }
    }, [info])

    const checkFavorites = () => {
        let favoritesGroups = JSON.parse(localStorage.getItem("favorites2"))
        if (favoritesGroups && info?.group?._id) {
            return favoritesGroups.some(gr => {
                return gr.name === info.name && gr.university === info?.group?.university?.code
            })
        }
        return false
    }

    const removeFromFavorites = () => {
        let favoritesGroups = JSON.parse(localStorage.getItem("favorites2"))

        if (favoritesGroups && info?.group?._id) {
            let myArray = favoritesGroups.filter(obj => {
                return !(obj.name === info.name && obj.university === info?.group?.university.code)
            })

            localStorage.setItem("favorites2", JSON.stringify(myArray))
        }
    }

    const addToFavorites = () => {
        let favoritesGroups = JSON.parse(
            localStorage.getItem("favorites2")
        )

        if (favorite) {
            removeFromFavorites()
        } else {
            if (favoritesGroups === null) {
                favoritesGroups = []
            }
            let isExists = checkFavorites()

            if (!isExists) {
                let _group = {
                    groupID: info.group.groupID,
                    name: info.group.name,
                    level: info.group.level,
                    id: info.group._id,
                    university: info?.group?.university?.code,
                    universityName: info?.group?.university?.short_name,
                    faculty: info.group.faculty
                }

                favoritesGroups.push(_group)
                localStorage.setItem("favorites2", JSON.stringify(favoritesGroups));
            }
        }

        const isFavorite = checkFavorites()
        setFavorite(isFavorite)
        // props.checkFavorites();
    }

    useEffect(() => {
        // console.log(groups)
    }, [groups])

    const dateClick = (date) => {
        scrollTo(date)
    }

    return (
        <div className={cn(styles.container_wrapper, settings?.calDir === "top" && styles.top)}>
            <div className={styles.container}>
                        <div className={styles.title_container}>
                            <div
                                className={cn(styles.icon_button, inCompareList && styles.compare)}
                                onClick={() => {
                                    // addToCompare(info.id, info.name)
                                    dispatch(addGroupToCompare({id: info.id, name: info.name, univer: (university || 'dstu')}))
                                    setInCompareList(true)
                                }
                                }>
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
                            <button onClick={prev}>
                                <svg width="11" height="17" viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 2L2.77524 8.01134C2.35679 8.41544 2.37025 9.09005 2.80448 9.47714L9 15" stroke="var(--menu-bg)" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                            </button>

                            <div className={styles.calendar_mini}>
                                {week.map((day, index) =>
                                    <div onClick={() => dateClick(day)} className={cn(styles.day_cont, lookAt === day && styles.current, holidays.includes(day) && styles.holiday)}>
                                        <p>{day.split('-')[2]}</p>
                                        <p className={styles.day_name}>{daysOfWeek[index]}</p>
                                        <span className={styles.subject_number}>{info.sked[day] && info.sked[day].length>0 && <>{info.sked[day].map(n => <div className={styles.number_dot}/>)}</>}</span>
                                    </div>
                                )}
                            </div>

                            <button onClick={next}>
                                <svg width="11" height="17" viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 2L8.22476 8.01134C8.64321 8.41544 8.62975 9.09005 8.19552 9.47714L2 15" stroke="var(--menu-bg)" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                {/*    </>*/}
                {/*}*/}
            </div>
        </div>
    )
}

export default ViewHeaderNew