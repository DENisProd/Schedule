import {useDispatch, useSelector} from "react-redux";
import styles from './settings.module.scss'
import {useNavigate} from "react-router-dom";
import {Theme} from "./Theme/Theme";
import {CalendarPosition} from "./CalendarPosition/CalendarPosition";

import EmptyPhoto from '../../../assets/photo.svg'
import {useEffect} from "react";
import {getPersonalData} from "../../../asyncActions/personal";
import {setUserAction} from "../../../store/userReducer";

export const Settings = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            if (!user?.name) {
                const userData = await getPersonalData()
                dispatch(setUserAction(userData))
                return userData
            }
        }

        getUser().then(r => {
            console.log(r)
        })
    }, [])

    return (
        <>
            <div className={styles.header}>
                <button className={styles.back} onClick={() => navigate('/main/')}>
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M6.09091 11.4205L0.579545 5.90909L6.09091 0.397727L7.26136 1.55682L3.75568 5.0625H12.2727V6.75568H3.75568L7.26136 10.2557L6.09091 11.4205Z"
                            fill="white"/>
                    </svg>
                    Назад
                </button>
                <h3>Настройки</h3>
            </div>
            <section className={styles.user_section}>
                <div className={styles.user}>
                    <img
                        src={user?.photo || EmptyPhoto}/>
                    <h2>{user?.displayName}</h2>
                </div>
                <button className={styles.open_btn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="14" viewBox="0 0 6 14" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M0.325839 0.948948C-0.0245611 1.22927 -0.0813722 1.74057 0.198948 2.09097L4.12623 7.00007L0.198947 11.9092C-0.0813727 12.2596 -0.0245616 12.7709 0.325839 13.0512C0.676239 13.3315 1.18754 13.2747 1.46786 12.9243L5.80119 7.50764C6.03858 7.2109 6.03858 6.78925 5.80119 6.49251L1.46786 1.07584C1.18754 0.725439 0.67624 0.668628 0.325839 0.948948Z"
                              fill="white"/>
                    </svg>
                </button>
            </section>
            <section className={styles.section}>
                <h3>Внешний вид</h3>
                <Theme/>
                <CalendarPosition/>
            </section>
        </>
    )
}
export default Settings
