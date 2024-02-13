import styles from './button.module.scss'
import cn from 'classnames'

export const Button = ({type, onClick, children}) => {
    return (
        <button className={cn(styles.button)} onClick={onClick}>
            {children}
        </button>
    )
}