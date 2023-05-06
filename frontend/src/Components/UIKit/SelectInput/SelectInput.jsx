import { useState } from 'react';

import styles from "./select-input.module.scss"

export function SelectInput({ options, value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    function handleOptionClick(option) {
        onChange(option);
        setIsOpen(false);
    }

    return (
        <div className={styles.custom_select}>
            <div className={styles.selected_value} onClick={() => setIsOpen(!isOpen)}>
                {value}
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <ul className={styles.options}>
                    {Object.values(options).map((option, index) => (
                        <li key={option} onClick={() => handleOptionClick(Object.keys(options)[index])}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}