import React, {useState} from "react";

import styles from './create-stud.module.scss'
import useInput from "../UIKit/TextField/useInput";
import TextField from "../UIKit/TextField/TextField";
import TextArea from "../UIKit/TextField/TextArea";
import {NavLink} from "react-router-dom";
import {Button} from "../UIKit/Button/Button";
import axios from "axios";
import {UNIVERSITIES_URLS} from "../../utils/urlsUtils";

export const CreateSection = ({ university, update }) => {
    const title = useInput('', {isEmpty: true, minLength: 3}, null, true, true)
    const type = useInput('', {isEmpty: true, minLength: 3}, null, true, true)
    const short_description = useInput('', {isEmpty: true, minLength: 3}, null, false, true)
    const description = useInput('', {isEmpty: true, minLength: 3}, null, false, true)
    const image = useInput('', {isEmpty: true, minLength: 3}, null, true, true)
    const location = useInput('', {isEmpty: true, minLength: 3}, null, true, true)

    const create = () => {
        const data = {
            title: title.value,
            type: type.value,
            short_description: short_description.value,
            description: description.value,
            image: image.value,
            location: location.value,
            university: university._id,
            author_id: localStorage.getItem('clientId')
        }
        const token = localStorage.getItem('token');
        const header = `Authorization: Bearer ${token}`;
        axios.post(UNIVERSITIES_URLS.STUDORGS, data, {headers: {header}}).then(res => {
            console.log(res.data)
        })
        // axios.post(UNIVERSITIES_URLS.STUDORGS, data).then(res => {
        //     console.log(res.data)
        //     update()
        // })
    }

    return (
        <div className={styles.main_container}>

            <p className={styles.field_container}>
                <div className={styles.field_title}>Название</div>
                <div>
                    <TextField  useInput={title} name="title" placeholder="Название организации"/>
                </div>
            </p>

            <p className={styles.field_container}>
                <div className={styles.field_title}>Краткое описание</div>
                <div>
                    <TextArea useInput={short_description} name="short_description" placeholder={'Краткое описание'}/>
                </div>
            </p>

            <p className={styles.field_container}>
                <div className={styles.field_title}>Полное описание</div>
                <div>
                    <TextArea useInput={description} name="description" placeholder={'Полное описание'}/>
                </div>
            </p>

            <p className={styles.field_container}>
                <div className={styles.field_title}>Ссылка на изображение</div>
                <div>
                    <TextField  useInput={image} name="image" placeholder="Изображение"/>
                </div>
            </p>

            <p className={styles.field_container}>
                <div className={styles.field_title}>Ссылка на сайт организации</div>
                <div>
                    <TextField  useInput={location} name="image" placeholder="Ссылка на сайт организации"/>
                </div>
            </p>

            <p className={styles.field_container}>
                <div className={styles.field_title}>Тип организации</div>
                <div>
                    <TextField  useInput={type} name="type" placeholder="Тип организации"/>
                </div>
            </p>

            <p>
                <Button onClick={create}>+ Создать</Button>
            </p>
        </div>
    )
}