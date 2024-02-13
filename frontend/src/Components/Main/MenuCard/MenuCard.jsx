import styles from './menu-card.module.scss'
import Img from '../../../assets/map_icon.svg'
import {Link, useNavigate} from "react-router-dom";

export const MenuCard = ({ card }) => {
    const navigate = useNavigate()

    const click = () => {
        if (card.navigate.includes('https')) {
            window.location.href = card.navigate
        }
    }

    console.log(card)

    return (
        <Link to={card.navigate} className={styles.card} onClick={click}>
            {card.img}
            <h3>{card.title}</h3>
        </Link>
    )
}