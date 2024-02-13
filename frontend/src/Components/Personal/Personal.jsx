import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getPersonalData, getReferalCount} from "../../asyncActions/personal";
import EmptyPhoto from '../../assets/photo.svg'

import styles from './personal.module.scss'
import {QRCode} from "./QRCode";
import {useNavigate} from "react-router-dom";
import {setUserAction} from "../../store/userReducer";


const Personal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(state => state.user.user)
    const [isCopy, setIsCopy] = useState(false)
    const [refData, setRefData] = useState(null)

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

    const [value, setValue] = useState("");
    const [qr, setQr] = useState("");

    const copyLink = () => {
        const link = "https://schedule.darksecrets.ru/invite/" + user?._id
        navigator.clipboard.writeText(link)
        setIsCopy(true)
    }

    useEffect( () => {
        const getRef = async () => {
            const referalData = await getReferalCount(user._id)
            setRefData(referalData)
        }
        if (user?._id) {
            getRef()
        }
    }, [user])

    return (
        <div className={styles.main}>
            <header>
                <button onClick={() => navigate('/main/')}>Назад</button>
                <h1>Личный кабинет</h1>
            </header>

            <div className={styles.user_card}>
                <img src={user?.photo || EmptyPhoto}/>
                <p>{user?.displayName || 'Имя Фамилия'}</p>
            </div>

            {/*<div className={styles.hot_block}>*/}
            {/*        <svg width="800px" height="800px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"/></svg>*/}
            {/*        Данные синхронизированы*/}
            {/*</div>*/}

            {user?._id &&
                <div className={styles.code_block}>
                    <div>
                        <div className={styles.center}>
                            Реферальная ссылка
                            <button className={styles.copy} onClick={copyLink}>
                                {isCopy ?
                                    <>
                                        <svg className={styles.fill} fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1"
                                             xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 512 512" >
                                             <path d="M437.016,74.984c-99.979-99.979-262.075-99.979-362.033,0.002c-99.978,99.978-99.978,262.073,0.004,362.031
                                                            c99.954,99.978,262.05,99.978,362.029-0.002C536.995,337.059,536.995,174.964,437.016,74.984z M406.848,406.844
                                                            c-83.318,83.318-218.396,83.318-301.691,0.004c-83.318-83.299-83.318-218.377-0.002-301.693
                                                            c83.297-83.317,218.375-83.317,301.691,0S490.162,323.549,406.848,406.844z"/>
                                             <path d="M368.911,155.586L234.663,289.834l-70.248-70.248c-8.331-8.331-21.839-8.331-30.17,0s-8.331,21.839,0,30.17
                                                            l85.333,85.333c8.331,8.331,21.839,8.331,30.17,0l149.333-149.333c8.331-8.331,8.331-21.839,0-30.17
                                                            S377.242,147.255,368.911,155.586z"/>
                                        </svg>
                                        Скопировано
                                    </>
                                    :
                                    <>
                                        <svg width="800px" height="800px" viewBox="0 -0.5 25 25" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd"
                                                  d="M8.94605 4.99995L13.2541 4.99995C14.173 5.00498 15.0524 5.37487 15.6986 6.02825C16.3449 6.68163 16.7051 7.56497 16.7001 8.48395V12.716C16.7051 13.6349 16.3449 14.5183 15.6986 15.1717C15.0524 15.825 14.173 16.1949 13.2541 16.2H8.94605C8.02707 16.1949 7.14773 15.825 6.50148 15.1717C5.85522 14.5183 5.495 13.6349 5.50005 12.716L5.50005 8.48495C5.49473 7.5658 5.85484 6.6822 6.50112 6.0286C7.1474 5.375 8.0269 5.00498 8.94605 4.99995Z"
                                                  stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                                  stroke-linejoin="round"/>
                                            <path
                                                d="M10.1671 19H14.9371C17.4857 18.9709 19.5284 16.8816 19.5001 14.333V9.666"
                                                stroke="#000000" strokeWidth="1.5" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                        </svg>
                                        Копировать
                                    </>
                                }
                            </button>
                        </div>
                        <div>Переходов: {refData?.invitedCount}</div>
                    </div>
                    <QRCode userId={user?._id}/>
                </div>
            }
        </div>
    )
}

export default Personal