import {useContext, useEffect, useState} from "react";
import {ThemeContext, themes} from "../../../contexts/ThemeContext";
import styles from "./settings.module.scss";
import cn from "classnames";
import ToggleButton from "../ToggleButton/ToggleButton";

import {SettingsContext} from "../../../providers/SettingsProvider";

const version = "0.83b2"

const SettingsScreen = () => {
    const {settings, setSettings} = useContext(SettingsContext)
    const {theme, setTheme} = useContext(ThemeContext)

    const [isOn, toggle] = useState(null)

    const changeCalendarDir = (direction) => {
        setSettings(prev => ({...prev, calDir: direction }))
        // setSettings(direction)
    }

    useEffect(() => {
        toggle(theme === themes.dark)
    }, [])

    useEffect(() => {
        if (isOn)setTheme(themes.dark)
        else setTheme(themes.light)
    }, [isOn])

    return (
        <div className={styles.settings_cont}>
            <h5>Настройки</h5>
            <div className={cn(styles.setting_line, styles.setting_container)}>
                <span>Версия приложения: {version}</span>
            </div>

            <div className={cn(styles.setting_line, styles.setting_container)}>
                <span>Темная тема</span>
                <ToggleButton {...{isOn, toggle}} />
            </div>

            <div className={cn(styles.choose_mode)}>
                <span>Расположения календаря</span>
                <div className={styles.choose_wrapper}>
                    <div onClick={() => changeCalendarDir("top")} className={cn(styles.choose_card, settings?.calDir === "top" && styles.selected)}>
                        <svg width="226" height="392" viewBox="0 0 226 392" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.5" y="1.5" width="223" height="389" rx="18.5" className={cn(styles.main, styles.stroke)} strokeWidth="3"/>
                            <rect x="16" y="100" width="193" height="65" rx="10" className={styles.secondary}/>
                            <rect x="16" y="178" width="193" height="65" rx="10" className={styles.secondary}/>
                            <rect x="16" y="256" width="193" height="65" rx="10" className={styles.secondary}/>
                            <circle cx="26" cy="373" r="10" className={styles.secondary}/>
                            <circle cx="199" cy="373" r="10" className={styles.secondary}/>
                            <circle cx="144" cy="373" r="10" className={styles.secondary}/>
                            <circle cx="88" cy="373" r="10" className={styles.secondary}/>
                            <rect x="35" y="33" width="155" height="35" className={styles.secondary}/>
                            <rect x="71" y="15" width="84" height="12" className={styles.secondary}/>
                            <path d="M206.078 52.2599L200.078 54.902V53.1761L204.186 51.527L204.131 51.6165V51.4034L204.186 51.4929L200.078 49.8438V48.1179L206.078 50.7599V52.2599Z" className={styles.secondary}/>
                            <path d="M17.0781 52.2599V50.7599L23.0781 48.1179V49.8438L18.9702 51.4929L19.0256 51.4034V51.6165L18.9702 51.527L23.0781 53.1761V54.902L17.0781 52.2599Z" className={styles.secondary}/>
                        </svg>
                        <h5>Сверху</h5>
                    </div>

                    <div onClick={() => changeCalendarDir("bottom")} className={cn(styles.choose_card, settings?.calDir ? (settings?.calDir === "bottom" && styles.selected) : styles.selected)}>
                        <svg width="226" height="392" viewBox="0 0 226 392" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.5" y="1.5" width="223" height="389" rx="18.5" className={cn(styles.main, styles.stroke)} strokeWidth="3"/>
                            <rect x="16" y="35" width="193" height="65" rx="10" className={styles.secondary}/>
                            <rect x="16" y="113" width="193" height="65" rx="10" className={styles.secondary}/>
                            <rect x="16" y="191" width="193" height="65" rx="10" className={styles.secondary}/>
                            <circle cx="26" cy="373" r="10" className={styles.secondary}/>
                            <circle cx="199" cy="373" r="10" className={styles.secondary}/>
                            <circle cx="144" cy="373" r="10" className={styles.secondary}/>
                            <circle cx="88" cy="373" r="10" className={styles.secondary}/>
                            <rect x="71" y="332" width="84" height="12" className={styles.secondary}/>
                            <rect x="36" y="289" width="155" height="35" className={styles.secondary}/>
                            <path d="M207.078 308.26L201.078 310.902V309.176L205.186 307.527L205.131 307.616V307.403L205.186 307.493L201.078 305.844V304.118L207.078 306.76V308.26Z" className={styles.secondary}/>
                            <path d="M18.0781 308.26V306.76L24.0781 304.118V305.844L19.9702 307.493L20.0256 307.403V307.616L19.9702 307.527L24.0781 309.176V310.902L18.0781 308.26Z" className={styles.secondary}/>
                        </svg>
                        <h5>Снизу</h5>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SettingsScreen