import styles from './story-screen.module.scss'
import {StoryProgress} from "./StoryProgress/StoryProgress";
import {useState} from "react";
import Story from '../../../assets/images/story.png'

const stories = [
    {
        title: 'Мы обновились',
        date: '11.10.2023',
        img: Story
    }
]

export const StoryScreen = () => {
    const [current, setCurrent] = useState(0)

    const prev = () => {

    }

    const next = () => {

    }

    return (
        <div className={styles.main_container}>
            {stories[current] &&
                <>
                    <header>
                        <StoryProgress count={stories.length} active={current}/>
                        <h2>{stories[current].title}</h2>
                        <h5>{stories[current].date}</h5>
                    </header>
                    <div className={styles.img_container}/>

                    <button onClick={prev}/>
                    <img className={styles.img_container} src={stories[current]?.img}/>
                    <button onClick={prev}/>
                </>
            }
        </div>
    )
}