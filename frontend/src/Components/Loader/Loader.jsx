import "./loader.css"

export default function Loader() {
    return (
        <div className="loader_container">
            <h2>Загружаю данные...</h2>
            <div className="cssload-loader">
                <div className="cssload-inner cssload-one"></div>
                <div className="cssload-inner cssload-two"></div>
                <div className="cssload-inner cssload-three"></div>
            </div>
        </div>
    )
}