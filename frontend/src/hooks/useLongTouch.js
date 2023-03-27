import {useState} from "react";

export default function useLongTouch (durationTouch, setIsLongTouch, durationHover) {
    const [element, setElement] = useState()
    let timer = null, lockTimer = null;

    const touchstart = (e) => {
        // e.preventDefault()
        e.stopPropagation()
        setElement(e.target)
        if(lockTimer) return
        timer = setTimeout(function () {
            setIsLongTouch(true)
        }, e.type==="mouseenter" ? durationHover : durationTouch)
        lockTimer = true
    }

    const touchend = () => {
        if (timer){
            clearTimeout(timer)
            lockTimer = false
        }
        setIsLongTouch(false)
    }

    return {
        element,
        touchstart,
        touchend
    }
}