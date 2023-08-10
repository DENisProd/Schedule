import styles from '../tasks.module.scss'
import DateAndTimePicker from "../DateAndTimePicker";
import ImagePicker from "../ImagePicker";
import CreatableSelect from "react-select/creatable";
import DateIcon from "../../../assets/date_icon.svg";
import TagIcon from "../../../assets/tag_icon.svg";
import CloseIcon from "../../../assets/close_icon.svg";
import {addTodo} from "../../../store/todoReducer";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";

export default function TaskCreate({setIsCreating, tagsList}) {
    const dispatch = useDispatch()

    const [inputValue, setInputValue] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')
    const [dateSelected, setDateSelected] = useState({})
    const [isDateSelect, setIsDateSelect] = useState(false)
    const [isTagSelect, setIsTagSelect] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectFileVisible, setSelectFileVisible] = useState(false)
    const [tags, setTags] = useState([])

    const handleSelectChange = (newValue, actionMeta) => {
        setSelectedOptions(newValue);
    };

    const handleAddTodo = (data) => {
        dispatch(addTodo(data))
    }

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }
    const handleDescription = (e) => {
        setDescriptionValue(e.target.value);
    }
    const addTask = () => {
        let data = {
            text: inputValue || '',
            photo: selectedFile || null,
            date: dateSelected?.date || null,
            start: dateSelected?.start || null,
            end: dateSelected?.end || null,
            tags: extractValuesFromArray(selectedOptions),
            description: descriptionValue || ''
        }
        handleAddTodo(data)

        setIsTagSelect(false)
        setIsDateSelect(false)
        setSelectFileVisible(false)
        setIsCreating(false)
    }

    function extractValuesFromArray(arrayOfObjects) {
        return arrayOfObjects.map((item) => item.value);
    }

    useEffect(() => {
        if (tagsList && Array.isArray(tagsList)) {
            tagsList.forEach(tag => {
                // Check if the tag already exists in the tags array
                if (!tags.some(existingTag => existingTag.value === tag)) {
                    setTags(prevTags => [
                        ...prevTags,
                        {
                            value: tag,
                            label: tag
                        }
                    ]);
                }
            });
        }
    }, [tagsList])

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            color: 'red',
            fontWeight: '500',
            borderRadius: '1rem',
            background: 'var(--background-color)',
            border: state.isFocused ? '2px solid var(--primary-cyan)' : '2px solid var(--background-color)',
            minHeight: 42
        }),
        option: (provided, state) => ({
            // стилизация отдельной опции
            ...provided,
            '&:hover': {
                background: 'var(--primary-cyan)',
            },
            background: 'var(--background-tile)',
            color: state.isSelected ? 'white' : 'black',
        }),
    }

    return (
        <div className={styles.inner_container}>
            <div className={styles.input_container}>
                <input placeholder={"Новая задача"} value={inputValue} onChange={handleChange}/>
                <div className={styles.button_cont} onClick={addTask}>
                    <button>Добавить</button>
                </div>
            </div>
            <div className={styles.description_input}>
                <input placeholder={"Описание"} value={descriptionValue} onChange={handleDescription}/>
            </div>

            {/*<ImagePicker setParentImage={setSelectedFile}/>*/}

            <div className={styles.tag_selector}>
                <CreatableSelect
                    isMulti
                    options={tags}
                    onChange={handleSelectChange}
                    value={selectedOptions}
                    styles={customStyles}
                    placeholder={"Выберите метки"}
                    noOptionsMessage={({inputValue}) => 'Используемых меток ещё нет. Создайте новые'}
                />
            </div>

            {/*<DateAndTimePicker setParentValue={setDateSelected}/>*/}

            <div className={styles.more_icons}>
                <img className={styles.icon_close} onClick={() => setIsCreating(false)} src={CloseIcon}/>
            </div>
        </div>
    )
}