import axios from "axios";
import {URLS} from "./urlsUtils";
import {removeDuplicates} from "./localStorageHelpers";

export function checkId() {
    localStorage.removeItem('favorites')
    localStorage.removeItem('my-group')
    localStorage.removeItem('searchList')
    const favoriteGroups = JSON.parse(localStorage.getItem("favorites2"));
    const searchGroups = JSON.parse(localStorage.getItem("searchList2"));
    const enterCounts = Number.parseInt(localStorage.getItem("count_enter"))
    const myGroupID = localStorage.getItem("my-group2")

    let uniqueList = null
    if (searchGroups) {
        uniqueList = removeDuplicates(searchGroups, ["name", "universityName"]);
        localStorage.setItem("searchList2", JSON.stringify(uniqueList))
    }

    const data = {
        clientId: localStorage.getItem('clientId') || 0,
        favoriteGroups,
        searchGroups: uniqueList || searchGroups,
        enterCounts,
        myGroupID
    }
    axios.post(URLS.ME, data)
        .then(response => {
            const receivedClientId = response.data.clientId
            localStorage.setItem('clientId', receivedClientId)
        })
        .catch(error => {
            console.error('Ошибка при получении уникального идентификатора:', error);
        });
}