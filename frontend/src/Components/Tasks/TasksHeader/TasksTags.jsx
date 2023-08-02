import styles from './tasks-header.module.scss'

const tags = [
    "ДЗ",
    "Деканат",
    "Практика",
    "Курсовая",
    "Важно"
]

export const TasksHeader = ({setSelectedTag}) => {

    const getRandomTags = () => {
        let array = [];
        let max = tags.length > 0 ? 5 : tags.length;
        while (array.length < max) {
            let rand = getRandomNumber(tags.length - 1);
            if (!array.includes(tags[rand])) {
                array.push(tags[rand]);
            }
        }
        array.push('Ещё');
        console.log(array);
        return array;
    }

    const selectTag = (tag) => {
        if (setSelectedTag) setSelectedTag(tag)
    }

    function getRandomNumber(max, min = 0) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
        <div className={styles.buttons_container}>
            {getRandomTags().map(tag =>
                <button onClick={() => selectTag(tag)}>{tag}</button>
            )}
        </div>
    )
}