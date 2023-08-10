import styles from './search-input.module.scss'
import {useEffect, useState} from "react";
import useDebounce from "../../../hooks/useDebounce";

export const TaskSearch = ({setParentText, enter, placeholder}) => {

    const [searchText, setSearchText] = useState('')

    const debouncedSearchTerm = useDebounce(searchText, 300);

    useEffect(() => {
        enter()
    }, [debouncedSearchTerm])

    const handleChange = (e) => {
        setSearchText(e.target.value)
        setParentText(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            if (enter) enter()
        }
    };

    return (
        <div className={styles.search_container}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.9706 13.072L17 17M15.2269 7.95238C15.2269 11.7921 12.0421 14.9048 8.11343 14.9048C4.18479 14.9048 1 11.7921 1 7.95238C1 4.11268 4.18479 1 8.11343 1C12.0421 1 15.2269 4.11268 15.2269 7.95238Z" stroke="#9C9D9F" stroke-width="1.5" stroke-linecap="round"/>
            </svg>

            <input placeholder={placeholder || "Поиск..."}
                   value={searchText}
                   onChange={handleChange}
                   onKeyDown={handleKeyPress}
            />
        </div>
    )
}