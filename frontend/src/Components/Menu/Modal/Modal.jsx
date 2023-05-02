import styles from "./modal.module.scss"

import vkHeader from "../../../assets/vk_bg.webp"

const info = {
    "vk": {
        img: vkHeader,
        text: "Наша официальная группа в VK. Здесь выходят все новости проекта. Подпишитесь, чтобы не пропустить!"
    },
    "compare": {
        img: vkHeader,
        text: "Хотите провести собрание, но не можете найти время, когда все свободны? Сравнение расписаний групп вам поможет!"
    }
}

const Modal = ({name, setIsOpen}) => {

    const GetInfoFromName = () => {
        if (name) return (
            <div>
                <img src={info[name].img} alt={name + "_icon"}/>
                <p>{info[name].text}</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <GetInfoFromName/>
        </div>
    )
}

export default Modal