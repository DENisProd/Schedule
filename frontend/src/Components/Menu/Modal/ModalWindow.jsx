import styles from "./modal-window.module.scss"
import cn from "classnames";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ver} from "../../../App";

import Slide1 from '../../../assets/images/slide1.png'

export default function ModalWindow({setIsModalOpen}) {
    const [isClosing, setIsClosing] = useState(false)
    const [isSettings, setIsSettings] = useState(false)
    const [isModalOpen, setIsModalOpened] = useState(false)
    const [inspectName, setInspectName] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        document.getElementById('root').classList.add('scroll-blocked')
        setIsClosing(false)
    }, [])

    const close = () => {
        setIsClosing(true)
        document.getElementById('root').classList.remove('scroll-blocked')
        setTimeout(function () {
            setIsModalOpen(false)
            localStorage.setItem("version", ver)
            setInspectName(null)
        }, 250)
    }

    return (
        <div className={styles.menu_container}>
            <div className={styles.background} onClick={close}/>
            <div className={cn(styles.content, isClosing && styles.closed, isSettings && styles.settings)}>
                <h2>Расписание обновлено <button className={styles.btn_close} onClick={close}>X</button></h2>
                <div>
                    <p>Теперь вы не заблудитесь с картой корпусов</p>
                    <div className={styles.img}>
                        <img src={Slide1}/>
                    </div>
                </div>
            </div>
        </div>
    )
}