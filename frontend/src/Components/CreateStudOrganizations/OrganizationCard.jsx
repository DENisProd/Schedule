import styles from "./organization-card.module.scss";

export const OrganizationCard = ({ tile }) => {
    return (
        <div className={styles.util_card} onClick={() => document.location.href = tile?.location || '#'}>
            <img src={tile.img || tile.image}/>
            <div className={styles.overlay}/>
            <h1>{tile.title}</h1>
            <h3>{tile.short_description}</h3>
        </div>
    )
}