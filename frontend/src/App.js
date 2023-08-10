import "./App.css";
import {useContext, useEffect, useState} from "react"
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import View from "./Components/View";
import Admin from "./Components/Admin/Admin";
import Navigator from "./Components/Navigator/Navigator";

import Compare from "./Components/Compare/Compare";
import {ThemeProvider} from "./providers/ThemeProvider";
import BottomNavigation from "./Components/BottomNavigation/BottomNavigation";
import FavoritesNew from "./Components/FavoritesNew/FavoritesNew";
import ViewNew from "./Components/ViewNew/ViewNew";
import {SettingsContext} from "./providers/SettingsProvider";
import {checkGroups} from "./utils/localStorageHelpers";
import ModalWindow from "./Components/Menu/Modal/ModalWindow";
import Compare2 from "./Components/Compare/Compare2";
import {Tasks} from "./Components/Tasks/Tasks";
import {Queue} from "./Components/Queue/Queue";
import {CreateSchedule} from "./Components/CreateSchedule/CreateSchedule";
import {checkId} from "./utils/checkId";

export const ver = "1.0.3"

function App() {
    const [isOffline, setIsOffline] = useState(false)
    const [compareList, setCompareList] = useState([])
    const [groupsList, setGroupsList] = useState([])
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const {settings, setSettings} = useContext(SettingsContext)

    const [updateNewsShow, setUpdateNewsShow] = useState(false)

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

    const addToCompare = (group, name, university) => {
        let isExists = false
        compareList.map(gr => {
            if (group.id===gr.id) isExists=true
        })
        if (!isExists) {
            let tmp = JSON.parse(JSON.stringify(groupsList))
            tmp.push({
                id: group,
                name: name,
                univer: university
            })
            console.log(tmp)
            setGroupsList(tmp)
            setCompareList(prevState => [...prevState, group])
        }
        console.log(compareList)
        console.log(groupsList)
    }



    useEffect(() => {
        checkId()
        const href = window.location.href.split('/')
        //console.log(href)
        const groupId = checkGroups("groupId")
        const myGroup = checkGroups("my-group")
        const domainArray = href.slice(0,3)

        // const myGroup = JSON.parse(localStorage.getItem("my-group"))

        if (myGroup && href.length===4) window.location.href = domainArray[0] + '//' + domainArray[2] + '/group/' + myGroup.id + '?u=' + (myGroup?.university === undefined ? 'dstu' : myGroup?.university)
        else if (groupId && href.length===4) window.location.href = domainArray[0] + '//' + domainArray[2] + '/group/' + groupId.id + '?u=' + (myGroup?.university === undefined ? 'dstu' : myGroup?.university)

        if(IOS()) document.getElementById('root').classList.add('ios-detected')

        const version = localStorage.getItem("version")
        if (version !== ver) setUpdateNewsShow(true)
        
        window.addEventListener("offline", function () {
            setIsOffline(true)
        });
    }, []);

    try {

    return (
            <BrowserRouter>

                {isOffline && <div>offline</div>}
                { updateNewsShow && <ModalWindow setIsModalOpen={setUpdateNewsShow}/>}
                <Routes>
                    {/*<Route element={}/>*/}
                    <Route path="/" element={<FavoritesNew />} />
                    {/*<Route path="/group/:groupId" element={<View addToCompare={addToCompare} isGroup={true} />} />*/}
                    {settings?.viewType === "hor" ?
                        <Route path="/group/:groupId" element={<View addToCompare={addToCompare} isGroup={true} />} />
                        :
                        <Route path="/group/:groupId" element={<ViewNew isMobile={isMobile} addToCompare={addToCompare} isGroup={true} />} />
                    }
                    <Route path="/group/" element={<FavoritesNew />} />
                    <Route path="/room/:groupId" element={<View isRoom={true}/>} />
                    <Route path="/tasks/:groupId" element={<Tasks/>} />
                    <Route path="/tasks/" element={<Tasks/>} />
                    <Route path="/queue/:groupId" element={<Queue/>} />
                    <Route path="/queue/" element={<Queue/>} />
                    <Route path="/create/" element={<CreateSchedule/>} />
                    <Route path="/teacher/:groupId" element={<View isTeachers={true}/>} />
                    {/*<Route path="/favorites" element={<FavoritesNew />} />*/}
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/navigator/:audId" element={<Navigator />} />
                    <Route path="/compare/" element={<Compare2 compareList={compareList} groupsList={groupsList}/>} />
                </Routes>
                <BottomNavigation />
                {/*<img className="bg-img" src={bg}/>*/}
            </BrowserRouter>
    )

    } catch (e) {
        return(
            <h3>{e.toString()}</h3>
        )
    }
}

export default App;
