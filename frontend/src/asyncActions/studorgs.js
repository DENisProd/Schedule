import axios from "axios";
import {AUTH_URLS} from "../utils/urlsUtils";

export const getAllStudOrgs = async () => {
        const token = localStorage.getItem('token');
        const header = `Authorization: Bearer ${token}`;

        const response = await axios.get(AUTH_URLS.LOGIN + 'profile', {
            headers: {header},
        });
        return response.data
}