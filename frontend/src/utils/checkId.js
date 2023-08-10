import axios from "axios";

export function checkId() {
    axios.post('http://localhost:5000/user/me', { clientId: localStorage.getItem('clientId') || 0})
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