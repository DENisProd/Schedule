import styles from "./group-actions.module.scss";
import cn from 'classnames'
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

export const GroupActions = ({ info, children }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false)
    const menuRef = useRef(null)

    // const handleClickOutside = (event) => {
    //     if (menuRef.current && !menuRef.current.contains(event.target)) {
    //         setIsMenuVisible(false);
    //     }
    // };
    //
    // useEffect(() => {
    //     if (isMenuVisible) {
    //         document.addEventListener("click", handleClickOutside);
    //     }
    //
    //     return () => {
    //         document.removeEventListener("click", handleClickOutside);
    //     };
    // }, [isMenuVisible]);

    useEffect(() => {
        // console.log(info)
    }, [info])


    const close = () => {
        setIsMenuVisible(false)
    }

    return (
        <div className={styles.container}>
            <svg className={styles.details} onClick={() => {
                // console.log('open')
                setIsMenuVisible(!isMenuVisible)
            }} width="26" height="6"
                 viewBox="0 0 26 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M26 3C26 4.65685 24.6569 6 23 6C21.3431 6 20 4.65685 20 3C20 1.34315 21.3431 0 23 0C24.6569 0 26 1.34315 26 3Z"
                    fill="#F4F6F8"/>
                <path
                    d="M16 3C16 4.65685 14.6569 6 13 6C11.3431 6 10 4.65685 10 3C10 1.34315 11.3431 0 13 0C14.6569 0 16 1.34315 16 3Z"
                    fill="#F4F6F8"/>
                <path
                    d="M6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3Z"
                    fill="#F4F6F8"/>
            </svg>
            <div className={cn(styles.menu, isMenuVisible && styles.visible)} ref={menuRef} onClick={(event) => event.stopPropagation()}>
                <div>
                    <button onClick={close}>X</button>
                </div>
                {children}
            </div>

        </div>
    )
}