import styles from './main.module.scss'
import {useState} from "react";
import cn from 'classnames'
import axios from "axios";
import {AUTH_URLS, BASE_URL} from "../../utils/urlsUtils";
import {ModalNew} from "../ModalNew/ModalNew";
import {Link} from "react-router-dom";
import {ChangeUniversity} from "./ChangeUniversity/ChangeUniversity";
import {Tools} from "./Tools/Tools";

export const Main = () => {
    const [selectedUniversity, setSelectedUniversity] = useState('')
    const [menuOpened, setMenuOpened] = useState(false)
    const [modalOpened, setModalOpened] = useState(false)

    const logout = () => {

    }

    const login = () => {
        setModalOpened(true)
    }

    return (
        <section className={styles.main_section}>
            <ModalNew isOpen={modalOpened} setIsOpen={setModalOpened}/>
            <header className={styles.header}>
                <Link to={"/profile"}>
                    <button className={styles.header_btn}>
                        <UserIcon/>
                    </button>
                </Link>

                <Link to={"/settings"}>
                    <button className={styles.header_btn}>
                        <SettingsIcon/>
                    </button>
                </Link>
            </header>

            <ChangeUniversity setSelectedUniversity={setSelectedUniversity}/>

            <h1>Инструменты</h1>

            <Tools/>

            <p>omfpowefpowef pweofmpwemf ewf woef eow fom oefwofmeefowpfmpo</p>
            <p>omfpowefpowef pweofmpwemf ewf woef eow fom oefwofmeefowpfmpo</p>
            <p>omfpowefpowef pweofmpwemf ewf woef eow fom oefwofmeefowpfmpo</p>
            <p>omfpowefpowef pweofmpwemf ewf woef eow fom oefwofmeefowpfmpo</p>
            <p>omfpowefpowef pweofmpwemf ewf woef eow fom oefwofmeefowpfmpo</p>
            <p>omfpowefpowef pweofmpwemf ewf woef eow fom oefwofmeefowpfmpo</p>
            <p>omfpowefpowef pweofmpwemf ewf woef eow fom oefwofmeefowpfmpo</p>
        </section>
    )
}

const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.1 9.21994C18.29 9.21994 17.55 7.93994 18.45 6.36994C18.97 5.45994 18.66 4.29994 17.75 3.77994L16.02 2.78994C15.23 2.31994 14.21 2.59994 13.74 3.38994L13.63 3.57994C12.73 5.14994 11.25 5.14994 10.34 3.57994L10.23 3.38994C9.78 2.59994 8.76 2.31994 7.97 2.78994L6.24 3.77994C5.33 4.29994 5.02 5.46994 5.54 6.37994C6.45 7.93994 5.71 9.21994 3.9 9.21994C2.86 9.21994 2 10.0699 2 11.1199V12.8799C2 13.9199 2.85 14.7799 3.9 14.7799C5.71 14.7799 6.45 16.0599 5.54 17.6299C5.02 18.5399 5.33 19.6999 6.24 20.2199L7.97 21.2099C8.76 21.6799 9.78 21.3999 10.25 20.6099L10.36 20.4199C11.26 18.8499 12.74 18.8499 13.65 20.4199L13.76 20.6099C14.23 21.3999 15.25 21.6799 16.04 21.2099L17.77 20.2199C18.68 19.6999 18.99 18.5299 18.47 17.6299C17.56 16.0599 18.3 14.7799 20.11 14.7799C21.15 14.7799 22.01 13.9299 22.01 12.8799V11.1199C22 10.0799 21.15 9.21994 20.1 9.21994ZM12 15.2499C10.21 15.2499 8.75 13.7899 8.75 11.9999C8.75 10.2099 10.21 8.74994 12 8.74994C13.79 8.74994 15.25 10.2099 15.25 11.9999C15.25 13.7899 13.79 15.2499 12 15.2499Z" fill="var(--text-color)"/>
    </svg>
)

const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12C22 6.49 17.51 2 12 2C6.49 2 2 6.49 2 12C2 14.9 3.25 17.51 5.23 19.34C5.23 19.35 5.23 19.35 5.22 19.36C5.32 19.46 5.44 19.54 5.54 19.63C5.6 19.68 5.65 19.73 5.71 19.77C5.89 19.92 6.09 20.06 6.28 20.2C6.35 20.25 6.41 20.29 6.48 20.34C6.67 20.47 6.87 20.59 7.08 20.7C7.15 20.74 7.23 20.79 7.3 20.83C7.5 20.94 7.71 21.04 7.93 21.13C8.01 21.17 8.09 21.21 8.17 21.24C8.39 21.33 8.61 21.41 8.83 21.48C8.91 21.51 8.99 21.54 9.07 21.56C9.31 21.63 9.55 21.69 9.79 21.75C9.86 21.77 9.93 21.79 10.01 21.8C10.29 21.86 10.57 21.9 10.86 21.93C10.9 21.93 10.94 21.94 10.98 21.95C11.32 21.98 11.66 22 12 22C12.34 22 12.68 21.98 13.01 21.95C13.05 21.95 13.09 21.94 13.13 21.93C13.42 21.9 13.7 21.86 13.98 21.8C14.05 21.79 14.12 21.76 14.2 21.75C14.44 21.69 14.69 21.64 14.92 21.56C15 21.53 15.08 21.5 15.16 21.48C15.38 21.4 15.61 21.33 15.82 21.24C15.9 21.21 15.98 21.17 16.06 21.13C16.27 21.04 16.48 20.94 16.69 20.83C16.77 20.79 16.84 20.74 16.91 20.7C17.11 20.58 17.31 20.47 17.51 20.34C17.58 20.3 17.64 20.25 17.71 20.2C17.91 20.06 18.1 19.92 18.28 19.77C18.34 19.72 18.39 19.67 18.45 19.63C18.56 19.54 18.67 19.45 18.77 19.36C18.77 19.35 18.77 19.35 18.76 19.34C20.75 17.51 22 14.9 22 12ZM16.94 16.97C14.23 15.15 9.79 15.15 7.06 16.97C6.62 17.26 6.26 17.6 5.96 17.97C4.44 16.43 3.5 14.32 3.5 12C3.5 7.31 7.31 3.5 12 3.5C16.69 3.5 20.5 7.31 20.5 12C20.5 14.32 19.56 16.43 18.04 17.97C17.75 17.6 17.38 17.26 16.94 16.97Z" fill="var(--text-color)"/>
        <path d="M12 6.93018C9.93 6.93018 8.25 8.61018 8.25 10.6802C8.25 12.7102 9.84 14.3602 11.95 14.4202C11.98 14.4202 12.02 14.4202 12.04 14.4202C12.06 14.4202 12.09 14.4202 12.11 14.4202C12.12 14.4202 12.13 14.4202 12.13 14.4202C14.15 14.3502 15.74 12.7102 15.75 10.6802C15.75 8.61018 14.07 6.93018 12 6.93018Z" fill="var(--text-color)"/>
    </svg>
)