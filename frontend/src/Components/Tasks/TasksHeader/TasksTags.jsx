import styles from './tasks-header.module.scss'
import {useEffect, useState} from "react";

export const TasksTags = ({tagsList, setSelectedTag}) => {
    const [randomTags, setRandomTags] = useState([])

    useEffect(() => {
        getRandomTags()
    }, [tagsList])

    const getRandomTags = () => {
        let array = []
        if (tagsList) array.push("Все")

        if (tagsList.length > 5) {
            tagsList.map(tag => {
                let rand = getRandomNumber(tagsList.length - 1);
                if (!array.includes(tagsList[rand])) {
                    array.push(tagsList[rand])
                }
            })
        } else {
            array = [...array, ...tagsList]
        }

        // array.push('Ещё');
        setRandomTags(array);
    };

    const selectTag = (tag) => {
        if (setSelectedTag) setSelectedTag(tag)
    }

    function getRandomNumber(max, min = 0) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <div className={styles.buttons_container}>
            {tagsList.length > 0 &&
                <>
                    {randomTags.map(tag =>
                        <button onClick={() => selectTag(tag)}>{tag}</button>
                    )}
                </>
            }
        </div>
    )
}