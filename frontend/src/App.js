import "./App.css";
import {useEffect, useState} from "react"
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import Home from "./Components/Home";
import View from "./Components/View";
import BottomMenu from "./Components/BottomMenu/BottomMenu";
import Favorites from "./Components/Favorites/Favorites";
import Admin from "./Components/Admin/Admin";
import Navigator from "./Components/Navigator";

import bg from "./assets/8marta.png"
import Compare from "./Components/Compare/Compare";


function App() {
    const [isOffline, setIsOffline] = useState(false)
    const [compareList, setCompareList] = useState([])

    function IOS() {
        return [
                'iPad Simulator',
                'iPhone Simulator',
                'iPod Simulator',
                'iPad',
                'iPhone',
                'iPod'
            ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }

    const addToCompare = (group) => {
        let isExists = false
        compareList.map(gr => {
            if (group===gr) isExists=true
        })
        if (!isExists)
            setCompareList((prevState) => [...prevState, group])
        console.log(compareList)
    }

    useEffect(() => {
        const href = window.location.href.split('/')
        //console.log(href)
        const domainArray = href.slice(0,3)
        const groupId = Number(localStorage.getItem("groupId"));
        if (groupId && href.length===4) window.location.href = domainArray[0] + '//' + domainArray[2] + '/group/' + groupId

        if(IOS()) document.getElementById('root').classList.add('ios-detected')
        
        window.addEventListener("offline", function () {
            setIsOffline(true)
        });
    }, []);

    return (
            <BrowserRouter>
                {isOffline && <div>offline</div>}

                <Routes>
                    {/*<Route element={}/>*/}
                    <Route path="/" element={<Home />} />
                    <Route path="/group/:groupId" element={<View addToCompare={addToCompare} isGroup={true} />} />
                    <Route path="/group/" element={<Home/>} />
                    <Route path="/room/:groupId" element={<View isRoom={true}/>} />
                    <Route path="/teacher/:groupId" element={<View isTeachers={true}/>} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/navigator/:audId" element={<Navigator />} />
                    <Route path="/compare/" element={<Compare compareList={compareList} />} />
                </Routes>
                <BottomMenu />
                {/*<img className="bg-img" src={bg}/>*/}
            </BrowserRouter>
    );
}

export default App;
