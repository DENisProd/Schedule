import styles from "./bottom-navigation.module.scss"
import cn from "classnames"
import {useEffect, useState} from "react";
import Menu from "../Menu/Menu";
import {useLocation, useNavigate} from "react-router-dom";
import {checkGroups} from "../../utils/localStorageHelpers";

const BottomNavigation = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const groupId = checkGroups("groupId")
    const myGroup = checkGroups("my-group")

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
                <div className={cn(selected === '/menu/' && isModalOpen && styles.selected)} onClick={() => {
                    setSelected('/menu/')
                    setIsModalOpen(true)

                }}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_15_2)">
                            <path d="M3 3L23 3" stroke="#1137FF" strokeWidth="6" strokeLinecap="round"/>
                            <path d="M3 23L23 23" stroke="#1137FF" strokeWidth="6" strokeLinecap="round"/>
                            <path d="M3 13L23 13" stroke="#1137FF" strokeWidth="6" strokeLinecap="round"/>
                        </g>
                    </svg>
                    {/*<p>Меню</p>*/}
                </div>
                <div className={cn(selected === '/' && styles.selected)} onClick={() => {
                    setIsModalOpen(false)
                    navigate("/")
                }}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M2.16667 11.3751C2.16667 6.28946 6.28938 2.16675 11.375 2.16675C16.4606 2.16675 20.5833 6.28946 20.5833 11.3751C20.5833 16.4607 16.4606 20.5834 11.375 20.5834C6.28938 20.5834 2.16667 16.4607 2.16667 11.3751Z"
                            fill="#FFFFFF"/>
                        <path
                            d="M21.125 18.1L23.2068 20.1818C24.0422 21.0171 24.0422 22.3715 23.2068 23.2069C22.3715 24.0423 21.0171 24.0423 20.1817 23.2069L18.0999 21.1251M2.16667 11.3751C2.16667 6.28946 6.28938 2.16675 11.375 2.16675C16.4606 2.16675 20.5833 6.28946 20.5833 11.3751C20.5833 16.4607 16.4606 20.5834 11.375 20.5834C6.28938 20.5834 2.16667 16.4607 2.16667 11.3751Z"
                            stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {/*<p>Поиск</p>*/}
                </div>
                <div className={cn(selected.indexOf('tasks') !== -1 && styles.selected)} onClick={() => {
                    setIsModalOpen(false)
                    navigate("/tasks/2")
                }}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className={styles.stroke_only} d="M14 2H7C4.23858 2 2 4.23858 2 7V19C2 21.7614 4.23858 24 7 24H19C21.7614 24 24 21.7614 24 19V12" stroke="#1137FF" strokeWidth="4" strokeLinecap="round"/>
                        <path d="M24.4142 4.41421C25.1953 3.63316 25.1953 2.36684 24.4142 1.58579C23.6332 0.804738 22.3668 0.804738 21.5858 1.58579L24.4142 4.41421ZM12.5858 10.5858L11.1716 12L14 14.8284L15.4142 13.4142L12.5858 10.5858ZM21.5858 1.58579L12.5858 10.5858L15.4142 13.4142L24.4142 4.41421L21.5858 1.58579Z" fill="#1137FF"/>
                        <path d="M10.4142 18.4142L11.8284 17L9 14.1716L7.58579 15.5858L10.4142 18.4142ZM6.58579 16.5858C5.80474 17.3668 5.80474 18.6332 6.58579 19.4142C7.36684 20.1953 8.63316 20.1953 9.41421 19.4142L6.58579 16.5858ZM7.58579 15.5858L6.58579 16.5858L9.41421 19.4142L10.4142 18.4142L7.58579 15.5858Z" fill="#1137FF"/>
                    </svg>

                    {/*<p>Задачи</p>*/}
                </div>
                <div className={cn(selected.indexOf('group') !== -1 && styles.selected)}
                     onClick={() => {
                         setIsModalOpen(false)
                         console.log(myGroup)
                         if (myGroup) {
                             navigate("/group/" + myGroup.id + '?u=' + myGroup.university)
                         } else if (groupId) {
                             navigate("/group/" + groupId.id + '?u=' + myGroup.university)
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
                    {/*<p>Просмотр</p>*/}
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

            </div>
            {isModalOpen && <Menu setIsModalOpen={setIsModalOpen}/>}
        </>

    )
}

export default BottomNavigation