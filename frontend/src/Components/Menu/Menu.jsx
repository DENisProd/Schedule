import styles from "./Menu.module.scss"
import {useContext, useEffect, useState} from "react";
import cn from "classnames"
import {ThemeContext, themes} from "../../contexts/ThemeContext";

import CompareIcon from "../../assets/compare.png"
import VkIcon from "../../assets/vk.png"
import Modal from "./Modal/Modal";
import MenuButton from "./MenuButton/MenuButton";
import {useNavigate} from "react-router-dom";
import SettingsScreen from "./SettingsScreen/SettingsScreen";

const Menu = ({children, setIsModalOpen}) => {
    const [isClosing, setIsClosing] = useState(false)
    const [isSettings, setIsSettings] = useState(false)
    const [isModalOpen, setIsModalOpened] = useState(false)
    const [inspectName, setInspectName] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        document.getElementById('root').classList.add('scroll-blocked')
        setIsClosing(false)
    },[])

    const close = () => {
            setIsClosing(true)
        document.getElementById('root').classList.remove('scroll-blocked')
            setTimeout(function () {
                setIsModalOpen(false)
                setInspectName(null)
            }, 250)
    }

    const navTo = (action) => {
        setIsModalOpen(false)
        action()
    }

    const toggleSettings = () => {
        setIsSettings(!isSettings)
    }


    return (
        <>
            <div className={styles.menu_container}>
                {isModalOpen && inspectName && <Modal name={inspectName}/>}
                <div className={styles.background} onClick={close}/>
                <div className={cn(styles.content, isClosing && styles.closed, isSettings && styles.settings)}>

                    {isSettings ?
                        <SettingsScreen />
                    :
                        <>
                            <h5>Зажмите, чтобы узнать подробнее</h5>
                            <div className={styles.card_wrapper} contextMenu={e => e.preventDefault()}>
                                <MenuButton onClick={() => {
                                    document.location.href = "https://vk.com/public218030183"
                                }} setIsModalOpened={setIsModalOpened} setInspectName={setInspectName} name="vk" img={VkIcon} title={"Группа VK"}/>
                                <MenuButton onClick={() => navTo(() => navigate('/compare/'))} setIsModalOpened={setIsModalOpened} setInspectName={setInspectName} name="compare" img={CompareIcon} title={"Сравнение"}/>
                                <MenuButton onClick={() => navTo(() => navigate('/navigator/10'))} setIsModalOpened={setIsModalOpened} setInspectName={setInspectName} name="navigator" img={CompareIcon} title={"Карта корпусов"}/>
                            </div>
                        </>
                    }


                    <div className={styles.setting_icon}>
                        <svg onClick={toggleSettings} className={cn(isSettings && styles.active)} version="1.1" xmlns="http://www.w3.org/2000/svg"
                             viewBox="-100 -100 689.802 689.802">
                            <g>
                                <path d="M20.701,281.901l32.1,0.2c4.8,24.7,14.3,48.7,28.7,70.5l-22.8,22.6c-8.2,8.1-8.2,21.2-0.2,29.4l24.6,24.9
                                    c8.1,8.2,21.2,8.2,29.4,0.2l22.8-22.6c21.6,14.6,45.5,24.5,70.2,29.5l-0.2,32.1c-0.1,11.5,9.2,20.8,20.7,20.9l35,0.2
                                    c11.5,0.1,20.8-9.2,20.9-20.7l0.2-32.1c24.7-4.8,48.7-14.3,70.5-28.7l22.6,22.8c8.1,8.2,21.2,8.2,29.4,0.2l24.9-24.6
                                    c8.2-8.1,8.2-21.2,0.2-29.4l-22.6-22.8c14.6-21.6,24.5-45.5,29.5-70.2l32.1,0.2c11.5,0.1,20.8-9.2,20.9-20.7l0.2-35
                                    c0.1-11.5-9.2-20.8-20.7-20.9l-32.1-0.2c-4.8-24.7-14.3-48.7-28.7-70.5l22.8-22.6c8.2-8.1,8.2-21.2,0.2-29.4l-24.6-24.9
                                    c-8.1-8.2-21.2-8.2-29.4-0.2l-22.8,22.6c-21.6-14.6-45.5-24.5-70.2-29.5l0.2-32.1c0.1-11.5-9.2-20.8-20.7-20.9l-35-0.2
                                    c-11.5-0.1-20.8,9.2-20.9,20.7l-0.3,32.1c-24.8,4.8-48.8,14.3-70.5,28.7l-22.6-22.8c-8.1-8.2-21.2-8.2-29.4-0.2l-24.8,24.6
                                    c-8.2,8.1-8.2,21.2-0.2,29.4l22.6,22.8c-14.6,21.6-24.5,45.5-29.5,70.2l-32.1-0.2c-11.5-0.1-20.8,9.2-20.9,20.7l-0.2,35
                                    C-0.099,272.401,9.201,281.801,20.701,281.901z M179.301,178.601c36.6-36.2,95.5-35.9,131.7,0.7s35.9,95.5-0.7,131.7
                                    s-95.5,35.9-131.7-0.7S142.701,214.801,179.301,178.601z"/>
                            </g>
                        </svg>
                        <button onClick={close} className={styles.exit_btn}>X</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu
