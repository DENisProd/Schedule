import styles from "./details-button.module.scss";
import cn from 'classnames'
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";

export const DetailsButton = ({subject}) => {
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
        // console.log(subject)
    }, [])

    return (
        <div className={styles.container}>
            <svg className={styles.details} onClick={() => {
                console.log('open')
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
                    <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                         width="800px" height="800px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64">
                        <path fill="#231F20" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24
                            C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24
                            C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"/>
                    </svg>
                    Показать на карте
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="800px" height="800px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
                        <path d="M67.6,20.1c-2.9,0-5.4,2.1-6.4,5c3.8,1.7,6.7,5.4,7.7,9.9c3.1-0.7,5.4-3.7,5.4-7.3
                            C74.3,23.4,71.3,20.1,67.6,20.1z"/>
                        <path d="M73.8,37.9c-1.3,1.2-2.9,2-4.7,2.3c-0.3,2.7-1.3,5.2-2.8,7.2h11.1c1.4,0,2.5-1.1,2.5-2.5v-1.2
                            C79.9,41,76.9,39.3,73.8,37.9z"/>
                        <path d="M63.2,50c-2,1.8-4.5,2.9-7.2,2.9c-0.2,3.1-1.1,5.9-2.5,8.3h14c1.6,0,3-1.3,3-3V57
                            C70.4,53.7,66.8,51.7,63.2,50z"/>
                        <path d="M50.3,65.2c-2.8,2.8-6.6,4.4-10.6,4.4c-4.1,0-7.9-1.7-10.7-4.6C24.4,67.2,20,70,20,74.1V76
                            c0,2.2,1.8,3.9,3.9,3.9h31.3c2.2,0,3.9-1.8,3.9-3.9v-1.8C59.1,70,54.9,67.3,50.3,65.2z"/>
                        <ellipse cx="39.6" cy="51.6" rx="10.7" ry="11.8"/>
                        <path d="M55.7,29.5c-3.7,0-6.8,2.7-7.7,6.5c3.7,2.4,6.4,6.5,7.5,11.2c0.1,0,0.1,0,0.2,0c4.4,0,8-4,8-8.9
                            C63.8,33.5,60.2,29.5,55.7,29.5z"/>
                    </svg>
                    <Link to={'/queue/create/'+subject?._id}>Создать очередь</Link>
                </div>
            </div>

        </div>
    )
}