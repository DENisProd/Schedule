import styles from './collapse-button.module.scss'
import cn from 'classnames'

export const CollapseButton = ({isFullView, setIsFullView}) => {
    return (
        <>
            <svg className={cn(styles.collapse_icon, isFullView && styles.collapse_reversed)} onClick={() => setIsFullView(!isFullView)} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10L9.29289 2.70711C9.68342 2.31658 10.3166 2.31658 10.7071 2.70711L18 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            </svg>
        </>
    )
}