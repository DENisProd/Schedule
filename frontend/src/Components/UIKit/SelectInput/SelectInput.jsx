import React, { useState, useEffect, useRef } from 'react';
import styles from './select-input.module.scss';
import cn from 'classnames';

export function SelectInput({ options, value, onChange, placeholder }) {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!selectRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isOpen])

    useEffect(() => {
        onChange(value)
    }, [value])

    function handleOptionClick(option) {
        onChange(option)
        setIsOpen(false)
    }

    return (
        <div className={styles.custom_select} ref={selectRef}>
            <div className={cn(styles.selected_value, isOpen && styles.is_open)} onClick={() => setIsOpen(!isOpen)}>
                {value ? value : <span className={styles.placeholder}>{placeholder || ''}</span>}
                <span className={cn(styles.arrow, isOpen && styles.open)}>
                    {/* SVG code */}
                </span>
            </div>
            <ul className={cn(styles.options, isOpen && styles.open)}>
                {Object.keys(options).map((key) => (
                    <li key={key} onClick={() => handleOptionClick(key)}>
                        {options[key]}
                    </li>
                ))}
            </ul>
        </div>
    );
}
