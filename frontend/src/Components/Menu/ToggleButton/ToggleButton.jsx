import styles from "./toggle.module.scss"
import cn from "classnames"

const ToggleButton = ({ isOn, toggle }) => (
    <div className={styles.btn} onClick={() => toggle(!isOn)}>
        <div
            className={cn(styles.circle, isOn ? styles.on : styles.off )}
        />
        <span className={cn(!isOn && styles.textOff)}>{isOn ? "ВКЛ" : "ВЫКЛ"}</span>
    </div>
)

export default ToggleButton