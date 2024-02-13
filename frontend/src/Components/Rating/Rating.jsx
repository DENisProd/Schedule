import {useEffect, useState} from "react";
import axios from "axios";
import {getRating} from "../../asyncActions/personal";
import styles from './rating.module.scss'
import cn from 'classnames'
import {LoadingScreen} from "../Loader/LoadingScreen/LoadingScreen";
import Loader2 from "../Loader/Loader2";
import {useNavigate} from "react-router-dom";

const Rating = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const get = async () => {
            let data = await getRating()
            console.log(data)
            data = data.filter(element => element != null)
            return data.sort((user1, user2) => user1['count'] < user2['count'] ? 1 : -1);

        }

        get().then(r => setUsers(r))
    }, [])

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <button onClick={() => navigate('/main/')} className={styles.back_btn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                        <g clipPath="url(#clip0_12_204)">
                            <path d="M0 8.88281C0 9.17578 0.128906 9.44531 0.363281 9.66797L8.14453 17.4375C8.37891 17.6602 8.625 17.7656 8.90625 17.7656C9.48047 17.7656 9.9375 17.3438 9.9375 16.7578C9.9375 16.4766 9.83203 16.1953 9.64453 16.0195L7.01953 13.3477L2.37891 9.11719L2.13281 9.69141L5.90625 9.92578H20.7305C21.3398 9.92578 21.7617 9.49219 21.7617 8.88281C21.7617 8.27344 21.3398 7.83984 20.7305 7.83984H5.90625L2.13281 8.07422L2.37891 8.66016L7.01953 4.41797L9.64453 1.74609C9.83203 1.55859 9.9375 1.28906 9.9375 1.00781C9.9375 0.421875 9.48047 0 8.90625 0C8.625 0 8.37891 0.09375 8.12109 0.351562L0.363281 8.09766C0.128906 8.32031 0 8.58984 0 8.88281Z" fill="black"/>
                        </g>
                    </svg>
                </button>
                <h1>Рейтинг рефералов</h1>
            </div>
            <div className={styles.rating_container}>
                {users.length > 0 ? users.map(user =>
                    <div className={styles.tile}>
                        <img src={user.photo}/>
                        <div className={cn(styles.username)}>{user.displayName}</div>
                        <div className={styles.number}>{user.count}</div>
                    </div>
                )
                :
                    <p>Данных нет</p>
                }
            </div>
        </div>
    )
}

export default Rating