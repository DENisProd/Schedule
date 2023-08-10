import styles from "../../ViewNew/ViewHeaderNew/view-header-new.module.scss"
import cn from "classnames";
import {useContext} from "react";
import {SettingsContext} from "../../../providers/SettingsProvider";

export default function CompareCalendar({todayDate, prev, next}) {

    const {settings, setSettings} = useContext(SettingsContext)

    return (
        <div className={cn(styles.container_wrapper, settings?.calDir === "top" && styles.top)}>
            <div className={styles.container}>
                <div className={styles.calendar_container}>
                    <button onClick={prev}>
                        <svg width="11" height="17" viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 2L2.77524 8.01134C2.35679 8.41544 2.37025 9.09005 2.80448 9.47714L9 15" stroke="var(--menu-bg)" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </button>
                    <div className={styles.calendar_mini}>
                        <div>29</div>
                        <div>30</div>
                        <div>31</div>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                    </div>
                    <button onClick={next}>
                        <svg width="11" height="17" viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L8.22476 8.01134C8.64321 8.41544 8.62975 9.09005 8.19552 9.47714L2 15" stroke="var(--menu-bg)" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}