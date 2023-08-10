import styles from './queue.module.scss'

import cn from 'classnames'
import {useState} from "react";

export const Queue = () => {
    const [isButtonActive, setIsButtonActive] = useState(true)

    return (
        <div className={styles.main_container}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Очередь</h2>
                    <p>ВИБ21 - 14.03, Пакеты прикладных программ</p>
                    <button className={cn(styles.join_btn, isButtonActive && styles.active)}>
                        <p className={styles.btn_title}>ЗАПИСАТЬСЯ</p>
                        {!isButtonActive && <p className={styles.btn_subtitle}>Запись откроется через... 1:59</p>}
                    </button>
                </div>

                <div className={styles.content}>

                </div>
            </div>
        </div>
    )
}