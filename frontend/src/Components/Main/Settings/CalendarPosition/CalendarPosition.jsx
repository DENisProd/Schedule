import styles from "../settings.module.scss";
import calendarPositionStyles from "./calendar-position.module.scss"
import cn from "classnames";
import {useContext, useEffect, useState} from "react";
import {themes} from "../../../../contexts/ThemeContext";
import {SettingsContext} from "../../../../providers/SettingsProvider";

export const CalendarPosition = () => {
    const [isHor, toggleViewOrientation] = useState(null)
    const {settings, setSettings} = useContext(SettingsContext)

    const changeCalendarDir = (direction) => {
        setSettings(prev => ({...prev, calDir: direction }))
    }

    useEffect(() => {
        toggleViewOrientation(settings?.viewType === 'hor')
    }, [])

    useEffect(() => {
        if(isHor) setSettings(prev => ({...prev, viewType: 'hor' }))
        else setSettings(prev => ({...prev, viewType: 'ver' }))
    }, [isHor])

    return (
        <div className={styles.block}>
            <div className={styles.block_inner}>
                <div className={styles.left}>
                    <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24">
                        <path
                            d="M19,4h-1V3c0-0.6-0.4-1-1-1s-1,0.4-1,1v1H8V3c0-0.6-0.4-1-1-1S6,2.4,6,3v1H5C3.3,4,2,5.3,2,7v1h20V7C22,5.3,20.7,4,19,4z M2,19c0,1.7,1.3,3,3,3h14c1.7,0,3-1.3,3-3v-9H2V19z M17,12c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S16.4,12,17,12z M17,16c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S16.4,16,17,16z M12,12c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,12,12,12z M12,16c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,16,12,16z M7,12c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S6.4,12,7,12z M7,16c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S6.4,16,7,16z"/>
                    </svg>
                    <div>Положение календаря</div>
                </div>
                {/*<button className={styles.open_btn}>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="14" viewBox="0 0 6 14"*/}
                {/*         fill="none">*/}
                {/*        <path fillRule="evenodd" clipRule="evenodd"*/}
                {/*              d="M0.325839 0.948948C-0.0245611 1.22927 -0.0813722 1.74057 0.198948 2.09097L4.12623 7.00007L0.198947 11.9092C-0.0813727 12.2596 -0.0245616 12.7709 0.325839 13.0512C0.676239 13.3315 1.18754 13.2747 1.46786 12.9243L5.80119 7.50764C6.03858 7.2109 6.03858 6.78925 5.80119 6.49251L1.46786 1.07584C1.18754 0.725439 0.67624 0.668628 0.325839 0.948948Z"*/}
                {/*              fill="white"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}
            </div>
            <div className={cn(calendarPositionStyles.choose_mode)}>
                <div className={calendarPositionStyles.choose_wrapper}>
                    <div onClick={() => changeCalendarDir("top")} className={cn(calendarPositionStyles.choose_card, settings?.calDir === "top" && calendarPositionStyles.selected)}>
                        <svg width="226" height="392" viewBox="0 0 226 392" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.5" y="1.5" width="223" height="389" rx="18.5" className={cn(calendarPositionStyles.main, calendarPositionStyles.stroke)} strokeWidth="3"/>
                            <rect x="16" y="100" width="193" height="65" rx="10" className={calendarPositionStyles.secondary}/>
                            <rect x="16" y="178" width="193" height="65" rx="10" className={calendarPositionStyles.secondary}/>
                            <rect x="16" y="256" width="193" height="65" rx="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="26" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="199" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="144" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="88" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <rect x="35" y="33" width="155" height="35" className={calendarPositionStyles.secondary}/>
                            <rect x="71" y="15" width="84" height="12" className={calendarPositionStyles.secondary}/>
                            <path d="M206.078 52.2599L200.078 54.902V53.1761L204.186 51.527L204.131 51.6165V51.4034L204.186 51.4929L200.078 49.8438V48.1179L206.078 50.7599V52.2599Z" className={calendarPositionStyles.secondary}/>
                            <path d="M17.0781 52.2599V50.7599L23.0781 48.1179V49.8438L18.9702 51.4929L19.0256 51.4034V51.6165L18.9702 51.527L23.0781 53.1761V54.902L17.0781 52.2599Z" className={calendarPositionStyles.secondary}/>
                        </svg>
                        <h5>Сверху</h5>
                    </div>

                    <div onClick={() => changeCalendarDir("bottom")} className={cn(calendarPositionStyles.choose_card, settings?.calDir ? (settings?.calDir === "bottom" && calendarPositionStyles.selected) : calendarPositionStyles.selected)}>
                        <svg width="226" height="392" viewBox="0 0 226 392" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1.5" y="1.5" width="223" height="389" rx="18.5" className={cn(calendarPositionStyles.main, calendarPositionStyles.stroke)} strokeWidth="3"/>
                            <rect x="16" y="35" width="193" height="65" rx="10" className={calendarPositionStyles.secondary}/>
                            <rect x="16" y="113" width="193" height="65" rx="10" className={calendarPositionStyles.secondary}/>
                            <rect x="16" y="191" width="193" height="65" rx="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="26" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="199" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="144" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <circle cx="88" cy="373" r="10" className={calendarPositionStyles.secondary}/>
                            <rect x="71" y="332" width="84" height="12" className={calendarPositionStyles.secondary}/>
                            <rect x="36" y="289" width="155" height="35" className={calendarPositionStyles.secondary}/>
                            <path d="M207.078 308.26L201.078 310.902V309.176L205.186 307.527L205.131 307.616V307.403L205.186 307.493L201.078 305.844V304.118L207.078 306.76V308.26Z" className={calendarPositionStyles.secondary}/>
                            <path d="M18.0781 308.26V306.76L24.0781 304.118V305.844L19.9702 307.493L20.0256 307.403V307.616L19.9702 307.527L24.0781 309.176V310.902L18.0781 308.26Z" className={calendarPositionStyles.secondary}/>
                        </svg>
                        <h5>Снизу</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}