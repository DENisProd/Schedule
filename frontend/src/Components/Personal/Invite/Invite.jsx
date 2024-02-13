import {LoadingScreen} from "../../Loader/LoadingScreen/LoadingScreen";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {checkId} from "../../../utils/checkId";

export const Invite = () => {
    const {userId} = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('InvitedBy', JSON.stringify({invited: false, invitedBy: userId}))
            checkId().then(status => {
                console.log(status)
                navigate('/')
            })
            setIsLoading(true)
        }
    }, [])

    return (
        <>
            <LoadingScreen/>
        </>
    )
}