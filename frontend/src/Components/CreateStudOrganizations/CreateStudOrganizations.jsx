import styles from './create-stud.module.scss'
import React, {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../utils/urlsUtils";
import {Dropdown} from "../UIKit/DropdownNew/Dropdown";
import {CATEGORIES} from "../CreateSchedule/Stage1/CreateUniversityStage1";
import {CreateSection} from "./CreateSection";
import {OrganizationCard} from "./OrganizationCard";
import {ChangeUniversity} from "../Main/ChangeUniversity/ChangeUniversity";
import {Button} from "../UIKit/Button/Button";
import {useNavigate} from "react-router-dom";

const CreateStudOrganizations = () => {
    const [selectedUniversity, setSelectedUniversity] = useState('')
    const [isCreateVisible, setIsCreateVisible] = useState(false)
    const [organizations, setOrganizations] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedUniversity) updateOrganizations()
    }, [selectedUniversity])

    const updateOrganizations = () => {
        axios.get(URLS.STUDORGS + selectedUniversity._id).then(res => setOrganizations(res.data))
        setIsCreateVisible(false)
    }

    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <button onClick={() => navigate('/main/')}>Назад</button>
                <div>Студенческие организации</div>
            </header>
            <Button onClick={() => setIsCreateVisible(true)}>+ Создать новую</Button>
            <div style={{height: '1.5rem'}}/>
            <div>
                <ChangeUniversity setSelectedUniversity={setSelectedUniversity}/>
                {isCreateVisible &&
                    <CreateSection university={selectedUniversity} update={updateOrganizations}/>
                }
                <div style={{height: '1.5rem'}}/>
                {Array.isArray(organizations) && organizations.map(org =>
                    <OrganizationCard tile={org}/>
                )}
            </div>
        </div>
    )
}

export default CreateStudOrganizations