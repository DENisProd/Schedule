import {useEffect} from "react";
import axios from "axios";
import {AUTH_URLS} from "../utils/urlsUtils";
import {setUserAction} from "../store/userReducer";
import {useDispatch, useSelector} from "react-redux";

export const getPersonalData = async () => {
    const token = localStorage.getItem('token');
    const header = `Authorization: Bearer ${token}`;

    const response = await axios.get(AUTH_URLS.LOGIN + 'profile', {
        headers: {header},
    });
    console.log(response)
    return response.data
}

export const getReferalCount = async (userId) => {
    const token = localStorage.getItem('token');
    const header = `Authorization: Bearer ${token}`;

    const response = await axios.get(AUTH_URLS.LOGIN + 'refcount/'+userId, {
        headers: {header},
    });
    return response.data
}

export const getRating = async () => {
    const token = localStorage.getItem('token');
    const header = `Authorization: Bearer ${token}`;

    const response = await axios.get(AUTH_URLS.RATING, {
        headers: {header},
    });
    return response.data
}