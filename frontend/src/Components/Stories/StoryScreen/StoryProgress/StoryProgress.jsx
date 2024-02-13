import styles from './story-progress.module.scss'
import cn from 'classnames'

export const StoryProgress = ({count, active}) => {
    let lines = []

    for (let i = 0; i < count; i++) {
        lines.push(
            <div className={cn(styles.line, (active ? (i === active && styles.active) : (i === 0 && styles.active)))}/>
        )
    }

    return (
        <div className={styles.container}>
            {lines}
        </div>
    )
}