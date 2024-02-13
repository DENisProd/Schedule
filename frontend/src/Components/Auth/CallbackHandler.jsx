import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {AUTH_URLS} from "../../utils/urlsUtils";
import {useDispatch, useSelector} from "react-redux";
import {setUserAction} from "../../store/userReducer";
import {LoadingScreen} from "../Loader/LoadingScreen/LoadingScreen";

export const CallbackHandler = ({ type }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        axios.get(AUTH_URLS.LOGIN + type + '/callback?code='+code).then(res => {
            localStorage.setItem('token', res.data.accessToken)
            dispatch(setUserAction(res.data.user))
            window.location.href = '/profile/'
            // navigate('/profile/')
        })
    }, [code])

    return (
        <>
            <LoadingScreen />
        </>
    )
}