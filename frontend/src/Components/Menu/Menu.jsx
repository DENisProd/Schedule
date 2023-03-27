import styles from "./Menu.module.scss"
import {useContext, useEffect, useState} from "react";
import cn from "classnames"
import {ThemeContext, themes} from "../../contexts/ThemeContext";

import CompareIcon from "../../assets/compare.png"
import VkIcon from "../../assets/vk.png"
import Modal from "./Modal/Modal";
import MenuButton from "./MenuButton/MenuButton";
import ToggleButton from "./ToggleButton/ToggleButton";
import {useNavigate} from "react-router-dom";

const Menu = ({children, setIsModalOpen}) => {
    const [isClosing, setIsClosing] = useState(false)
    const [isModalOpen, setIsModalOpened] = useState(false)
    const [inspectName, setInspectName] = useState(null)
    const [isOn, toggle] = useState(null)
    const {theme, setTheme} = useContext(ThemeContext)
    const navigate = useNavigate();

    useEffect(() => setIsClosing(false),[])

    const close = () => {
            setIsClosing(true)
            setTimeout(function () {
                setIsModalOpen(false)
                setInspectName(null)
            }, 250)
    }

    useEffect(() => {
        toggle(theme === themes.dark)
    }, [])

    useEffect(() => {
        if (isOn)setTheme(themes.dark)
        else setTheme(themes.light)
    }, [isOn])

    const navTo = (action) => {
        setIsModalOpen(false)
        action()
    }


    return (
        <>
            <div className={styles.menu_container}>
                {isModalOpen && inspectName && <Modal name={inspectName}/>}
                <div className={styles.background}/>
                <div className={cn(styles.content, isClosing && styles.closed)}>
                    <h5>Зажмите, чтобы узнать подробнее</h5>
                    <div className={styles.card_wrapper} contextMenu={e => e.preventDefault()}>
                        <MenuButton onClick={() => {
                            document.location.href = "https://vk.com/public218030183"
                        }} setIsModalOpened={setIsModalOpened} setInspectName={setInspectName} name="vk" img={VkIcon} title={"Группа VK"}/>
                        <MenuButton onClick={() => navTo(() => navigate('/compare/'))} setIsModalOpened={setIsModalOpened} setInspectName={setInspectName} name="compare" img={CompareIcon} title={"Сравнение"}/>
                    </div>
                    <div className={styles.theme_choose}>
                        <span>Темная тема</span>
                        <ToggleButton {...{isOn, toggle}} />
                    </div>
                    <button onClick={close} className={styles.exit_btn}>X</button>
                </div>
            </div>
        </>
    )
}

export default Menu
