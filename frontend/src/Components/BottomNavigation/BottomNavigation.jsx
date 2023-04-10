import styles from "./bottom-navigation.module.scss"
import cn from "classnames"
import {useEffect, useState} from "react";
import Menu from "../Menu/Menu";
import {useLocation, useNavigate} from "react-router-dom";

const BottomNavigation = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const groupId = Number(localStorage.getItem("groupId"));
    const myGroup = Number(localStorage.getItem("my-group"));

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selected, setSelected] = useState('/')

    const updateSelected = () => {
        const path = window.location.pathname
        setSelected(path)
    }

    useEffect(updateSelected, [location])

    return (
    <>
        <div className={styles.container}>
            <div className={cn(selected === '/' && styles.selected)} onClick={() => {
                setIsModalOpen(false)
                navigate("/")
            }}>
                <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>explore-solid</title>
                    <g id="Layer_2" data-name="Layer 2">
                        <g id="invisible_box" data-name="invisible box">
                            <rect width="48" height="48" fill="none" />
                        </g>
                        <g id="icons_Q2" data-name="icons Q2">
                            <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM34.7,14.7,28,28,14.7,34.7a1.1,1.1,0,0,1-1.4-1.4L20,20l13.3-6.7A1.1,1.1,0,0,1,34.7,14.7ZM24,22a2,2,0,1,0,2,2A2,2,0,0,0,24,22Z" />
                            <path d="M24,22a2,2,0,1,0,2,2A2,2,0,0,0,24,22Zm0,0a2,2,0,1,0,2,2A2,2,0,0,0,24,22Z" />
                        </g>
                    </g>
                </svg>
                <p>Поиск</p>
            </div>
            <div className={cn(selected.indexOf('group') !== -1  && styles.selected)}
                 onClick={() => {
                     setIsModalOpen(false)
                     if (myGroup) {
                         navigate("/group/" + myGroup)
                     } else if (groupId) {
                         navigate("/group/" + groupId)
                     } else {
                         navigate("/")
                     }
                     // navigate("/group/" + (myGroup > 100 ? myGroup : groupId))
                 }}>
                <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 24 24"
                    id="meteor-icon-kit__solid-view-grid"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2 0H9C10.1046 0 11 0.89543 11 2V9C11 10.1046 10.1046 11 9 11H2C0.89543 11 0 10.1046 0 9V2C0 0.89543 0.89543 0 2 0ZM15 0H22C23.1046 0 24 0.89543 24 2V9C24 10.1046 23.1046 11 22 11H15C13.8954 11 13 10.1046 13 9V2C13 0.89543 13.8954 0 15 0ZM2 13H9C10.1046 13 11 13.8954 11 15V22C11 23.1046 10.1046 24 9 24H2C0.89543 24 0 23.1046 0 22V15C0 13.8954 0.89543 13 2 13ZM15 13H22C23.1046 13 24 13.8954 24 15V22C24 23.1046 23.1046 24 22 24H15C13.8954 24 13 23.1046 13 22V15C13 13.8954 13.8954 13 15 13Z"
                    />
                </svg>
                <p>Просмотр</p>
            </div>
            {/*<div className={cn(selected === '/favorites/' && styles.selected)} onClick={() => {*/}
            {/*    setIsModalOpen(false)*/}
            {/*    navigate("/favorites/")*/}
            {/*}}>*/}
            {/*    <svg*/}
            {/*        width="800px"*/}
            {/*        height="800px"*/}
            {/*        viewBox="1 2 15 15"*/}
            {/*        xmlns="http://www.w3.org/2000/svg"*/}
            {/*        className="cf-icon-svg"*/}
            {/*    >*/}
            {/*        <path d="m12.673 10.779.798 4.02c.221 1.11-.407 1.566-1.395 1.013L8.5 13.81l-3.576 2.002c-.988.553-1.616.097-1.395-1.013l.397-2.001.401-2.02-1.51-1.397-1.498-1.385c-.832-.769-.592-1.507.532-1.64l2.026-.24 2.044-.242 1.717-3.722c.474-1.028 1.25-1.028 1.724 0l1.717 3.722 2.044.242 2.026.24c1.124.133 1.364.871.533 1.64L14.184 9.38z" />*/}
            {/*    </svg>*/}
            {/*    <p>Избранное</p>*/}
            {/*</div>*/}
            <div className={cn(selected === '/menu/' && isModalOpen && styles.selected)} onClick={() => {
                setSelected('/menu/')
                setIsModalOpen(true)

            }}>
                <svg width="372" height="372" viewBox="0 0 372 372" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_612_1891)">
                        <rect y="151" width="372" height="70" rx="32"/>
                        <rect y="302" width="372" height="70" rx="32"/>
                        <rect width="372" height="70" rx="32"/>
                    </g>
                </svg>
                <p>Меню</p>
            </div>
        </div>
        {isModalOpen && <Menu setIsModalOpen={setIsModalOpen}/>}
    </>

    )
}

export default BottomNavigation