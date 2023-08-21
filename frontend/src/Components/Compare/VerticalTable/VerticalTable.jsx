import styles from "./vertical-table.module.scss"
import cn from "classnames"

export default function VerticalTable({schedule, date}) {
    console.log(schedule)
    return (
        <>
            <h2 className={styles.header}>{date}</h2>
            <div className={styles.container}>
                <div className={styles.column}>
                    <div className={cn(styles.row, styles.title)}></div>
                    <div className={cn(styles.row, styles.title)}>1</div>
                    <div className={cn(styles.row, styles.title)}>2</div>
                    <div className={cn(styles.row, styles.title)}>3</div>
                    <div className={cn(styles.row, styles.title)}>4</div>
                    <div className={cn(styles.row, styles.title)}>5</div>
                    <div className={cn(styles.row, styles.title)}>6</div>
                    <div className={cn(styles.row, styles.title)}>7</div>
                </div>
                {Object.keys(schedule).length > 0 && Object.keys(schedule).map(group =>
                    <div style={{width: (100 / Object.keys(schedule).length) + '%'}} className={styles.column}>
                        <div className={cn(styles.row, styles.title)}>{group}</div>
                        {Object.keys(schedule[group]).map(subject =>
                        <>
                            <div className={cn(styles.row, schedule[group][subject].audName && styles.green)}>{schedule[group][subject]?.audName?.replace('Подгруппа:','')}</div>
                        </>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}