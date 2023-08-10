import {MainTerritory} from "./Buildings/MainTerritory";
import {useEffect, useRef} from "react";

export const MapComponent = ({ map, scrollToElementId }) => {

    const mapContainerRef = useRef(null);

    return (
        <>
                {map ? map : <MainTerritory />}
        </>
    );
};