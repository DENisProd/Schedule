import "./view-header.css"
import {useContext} from "react";
import {ThemeContext} from "../../contexts/ThemeContext";
import CalendarComponent from "./CalendarComponent";

import cn from "classnames"
import {SettingsContext} from "../../providers/SettingsProvider";

export function ViewHeaderTitle(props) {

    const addToFavorites = () => {
        let favoritesGroups = JSON.parse(
            localStorage.getItem("favorites")
        );

        if (props.inFavorites) {
            if (favoritesGroups.length > 0) {
                //console.log(props.group.groupID)
                let myArray = favoritesGroups.filter(
                    function (obj) {
                        return (obj.id !== props.group.group.groupID);
                    });
                localStorage.setItem("favorites", JSON.stringify(myArray));
            }
        } else {
            if (favoritesGroups === null) favoritesGroups = [];
            favoritesGroups.push({
                name: props.group.group.name,
                id: props.group.group.groupID
            });
            let favoritesFiltered = favoritesGroups.filter(gr => gr.hasOwnProperty('name')===true)
            localStorage.removeItem("favorites");
            localStorage.setItem("favorites", JSON.stringify(favoritesFiltered));
        }

        props.checkFavorites();
    }

    return (
    <header className="view-container">

        {props.isLoaded && props.isGroup &&
            <svg onClick={() => props.addToCompare(props.group.group.groupID, props.group.group.name)} className="compare-btn" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M3 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM3 8a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1ZM3 16a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z"/></svg>
        }


        {props.isRoom && <h2 className="title-h2">Аудитория {props.isLoaded && props.group.aud.name}</h2>}
        {props.isTeachers &&
            <h2 className="title-h2">Преподаватель {props.isLoaded && props.group.prepod.name}</h2>}
        {props.isGroup && <h2 className="title-h2">Группа {props.isLoaded && props.group.group.name}</h2>}


        {(props.isLoaded && props.isGroup) && (
            <div
                className={"icon-btn" + (props.inFavorites ? " favorite" : "")}
                onClick={addToFavorites}>
                <svg width="800px" height="800px" viewBox="-5.5 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m0 2.089v21.912l6.546-6.26 6.545 6.26v-21.912c-.012-1.156-.952-2.089-2.109-2.089-.026 0-.051 0-.077.001h.004-8.726c-.022-.001-.047-.001-.073-.001-1.158 0-2.098.933-2.109 2.088v.001z"/>
                </svg>
            </div>
        )}
    </header>
    )
}

const ViewHeader = (props) => {
    const {settings, setSettings} = useContext(SettingsContext)

    return (
        <div className={cn("view-header", settings?.calDir === "top" && "top")}>
            {settings?.calDir === "top" ?
                <>
                    <ViewHeaderTitle {...props}/>
                    <CalendarComponent currentDate={props.currentDate} updateSchedule={props.updateSchedule} groupedRasp={props.groupedRasp}
                                       scrollTo={props.scrollTo} lookAt={props.lookAt}/>
                </>
            :
                <>
                    <CalendarComponent currentDate={props.currentDate} updateSchedule={props.updateSchedule} groupedRasp={props.groupedRasp}
                                       scrollTo={props.scrollTo} lookAt={props.lookAt}/>
                    <ViewHeaderTitle {...props}/>
                </>
            }
        </div>
    )
}

export default ViewHeader