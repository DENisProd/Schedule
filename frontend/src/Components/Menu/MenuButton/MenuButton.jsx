import React, {useEffect, useState} from 'react';
import styles from "../Menu.module.scss";
import useLongTouch from "../../../hooks/useLongTouch";

const MenuButton = ({setIsModalOpened, setInspectName, name, img, title, onClick}) => {
    const [isLongTouch, setIsLongTouch] = useState(false)

    useEffect(() => {
        if (isLongTouch) setInspectName(name)
        else setInspectName(null)
        setIsModalOpened(isLongTouch)
    }, [isLongTouch])

    const longTouch = useLongTouch(300, setIsLongTouch, 100)

    return (
        <button className={styles.card} onTouchStart={longTouch.touchstart} onTouchEnd={longTouch.touchend}
                name={name} onMouseEnter={longTouch.touchstart} onMouseLeave={longTouch.touchend} onClick={onClick}
        >
            <img src={img} alt={name + '_icon'} contextMenu={(e) => {
                e.preventDefault();
            }}/>
            <h5>{title}</h5>
        </button>
    )
}

export default MenuButton;