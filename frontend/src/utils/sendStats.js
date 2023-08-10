import axios from "axios";
import {URLS} from "./urlsUtils";

export function sendStats() {
    let sended_date = new Date(localStorage.getItem("send_data"))
    if (sended_date.getDate() !== new Date().getDate()) {
        const favoritesGroups = JSON.parse(localStorage.getItem("favorites"));
        const enterCounts = Number.parseInt(localStorage.getItem("count_enter"))
        const myGroupID = Number.parseInt(localStorage.getItem("my-group"))
        let myGroupName = ""

        let convertedFavorites = []
        if (favoritesGroups) {
            favoritesGroups.forEach((favorites) => {
                if (favorites.id === myGroupID) myGroupName = favorites.name
                convertedFavorites.push(favorites.name)
            })
        }

        axios.post(URLS.STATS, {
            sg: JSON.parse(localStorage.getItem("searchList")),
            fav: convertedFavorites,
            count: enterCounts / 2,
            group: myGroupName,
            connection: navigator.connection
        }).then(res => {
            sended_date = new Date()
            localStorage.setItem("send_data", sended_date)
        })
        
    } else {
        console.log("пока рано")
    }
}