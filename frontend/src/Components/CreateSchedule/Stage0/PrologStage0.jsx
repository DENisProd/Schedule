import Art4 from '../../../assets/arts/Art4.svg'

import styles from '../create-schedule.module.scss'

export const PrologStage0 = ({setStage}) => {
    return (
        <>
            <p>Нет вашего учебного заведения или группы в списке? Создайте вручную, чтобы пользоваться многофункциональным расписанием.</p>
            <img src={Art4}/>
            <p>
                <button className={styles.nextButton} onClick={() => setStage(1)}>Далее</button>
            </p>
        </>
    )
}