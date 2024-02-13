import styles from "../settings.module.scss";
import themeStyles from './theme.module.scss'
import {useContext, useState} from "react";
import cn from 'classnames'
import {ThemeContext, themes} from "../../../../contexts/ThemeContext";
import {SettingsContext} from "../../../../providers/SettingsProvider";

export const Theme = () => {
    const [isVisible, setIsVisible] = useState(false)

    const {settings, setSettings} = useContext(SettingsContext)
    const {theme, setTheme} = useContext(ThemeContext)

    return (
        <div className={styles.block}>
            <div className={styles.block_inner} onClick={() => setIsVisible(prev => !prev)}>
                <div className={styles.left}>
                    <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path
                            d="M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zM7.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                    </svg>
                    <div>Цвет темы</div>
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
            <div className={cn(themeStyles.themes, isVisible && themeStyles.visible)}>
                <div className={themeStyles.color_container}>
                    <button className={cn(themeStyles.theme_btn, themeStyles.light_theme_btn)} onClick={() => setTheme(themes.light)}/>
                    <button className={cn(themeStyles.theme_btn, themeStyles.dark_theme_btn)} onClick={() => setTheme(themes.dark)}/>
                    <button className={cn(themeStyles.theme_btn, themeStyles.pink_theme_btn)} onClick={() => setTheme(themes.pink)}/>
                </div>
            </div>
        </div>
    )
}