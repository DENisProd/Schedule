import {useState} from "react";
import useLongTouch from "./useLongTouch";

export default function useMouseHover (duration, setIsLongTouch) {
    const longTouch = useLongTouch(duration, setIsLongTouch)

    return {
        element: longTouch.element,
        mouseEnter: longTouch.touchstart,
        mouseLeave: longTouch.touchend
    }
}