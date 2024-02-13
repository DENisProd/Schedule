import {ModalNew} from "../../ModalNew/ModalNew";
import {addTodo} from "../../../store/todoReducer";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import styles from "./create-task-modal.module.scss";
import CreatableSelect from "react-select/creatable";
import CloseIcon from "../../../assets/close_icon.svg";
import {Button} from "../../UIKit/Button/Button";
import useInput from "../../UIKit/TextField/useInput";
import TextField from "../../UIKit/TextField/TextField";
import ImagePicker from "../ImagePicker";
import TextArea from "../../UIKit/TextField/TextArea";

export const CreateTaskModal = ({isOpen, setIsOpen, tagsList}) => {
    const dispatch = useDispatch()

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

    const addTask = () => {
        let data = {
            text: text.value || '',
            photo: selectedFile || null,
            date: dateSelected?.date || null,
            start: dateSelected?.start || null,
            end: dateSelected?.end || null,
            tags: extractValuesFromArray(selectedOptions),
            description: description.value || ''
        }
        handleAddTodo(data)

        setIsTagSelect(false)
        setIsDateSelect(false)
        setSelectFileVisible(false)
        setIsOpen(false)
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
            background: 'var(--background-tile)',
            outline: 0,
            border: state.isFocused ? '2px solid var(--primary-color)' : '2px solid var(--primary-gray)',
            minHeight: 52
        }),
        option: (provided, state) => ({
            // стилизация отдельной опции
            ...provided,
            '&:hover': {
                background: 'var(--primary-gray)',
            },
            background: 'var(--background-tile)',
            color: 'var(--text-color)',
        }),
    }

    const text = useInput('', {isEmpty: true, minLength: 3}, null, true, true)
    const description = useInput('', {}, null, true, true)
    const full_description = useInput('', {}, null, false, true)

    return (
        <ModalNew isOpen={isOpen} setIsOpen={setIsOpen} title={'Создать задачу'}>
            <TextField useInput={text} name="text" placeholder="Новая задача"/>
            <TextField useInput={description} name="description" placeholder="Описание"/>

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

            <TextArea useInput={full_description} name="full_description" placeholder={'Полное описание'}/>

            <ImagePicker setParentImage={setSelectedFile}/>

            {/*<DateAndTimePicker setParentValue={setDateSelected}/>*/}

            {/*<div className={styles.more_icons}>*/}
            {/*    <img className={styles.icon_close} onClick={() => setIsCreating(false)} src={CloseIcon}/>*/}
            {/*</div>*/}

            <div className={styles.button}>
                <Button onClick={addTask}>Добавить</Button>
            </div>
        </ModalNew>
    )
}