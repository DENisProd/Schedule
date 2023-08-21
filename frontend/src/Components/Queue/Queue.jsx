import styles from './queue.module.scss'

import cn from 'classnames'
import {useState} from "react";
import {useParams} from "react-router-dom";
import {QueueView} from "./QueueView/QueueView";
import {CreateQueue} from "./CreateQueue/CreateQueue";

export const Queue = () => {
    const {queueId} = useParams();

    return (
        <>
            <QueueView queueId={queueId}/>
        </>
    )
}