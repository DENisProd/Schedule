import axios from "axios";
import {URLS} from "./urlsUtils";

export function checkId() {
    const favoriteGroups = JSON.parse(localStorage.getItem("favorites2"));
    const enterCounts = Number.parseInt(localStorage.getItem("count_enter"))
    const myGroupID = Number.parseInt(localStorage.getItem("my-group2"))
    const data = {
        clientId: localStorage.getItem('clientId') || 0,
        favoriteGroups,
        enterCounts,
        myGroupID
    }
    axios.post(URLS.ME, data)
        .then(response => {
            console.log(response)
            const receivedClientId = response.data.clientId
            console.log(receivedClientId);
            localStorage.setItem('clientId', receivedClientId)
        })
        .catch(error => {
            console.error('Ошибка при получении уникального идентификатора:', error);
        });
}