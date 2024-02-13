import "./App.css";
import {lazy, useContext, useEffect, useState, Suspense} from "react"
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import View from "./Components/View";
import Admin from "./Components/Admin/Admin";
// import Navigator from "./Components/Navigator/Navigator";

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
import {CreateTest} from "./Components/CreateTest/CreateTest";
import {CreateQueue} from "./Components/Queue/CreateQueue/CreateQueue";
import {Message} from "./Components/Message/Message";
import Loader2 from "./Components/Loader/Loader2";
import {Main} from "./Components/Main/Main";
import {StoryScreen} from "./Components/Stories/StoryScreen/StoryScreen";
import TechWorks from "./Components/TechWorks/TechWorks";
import Personal from "./Components/Personal/Personal";
import Settings from "./Components/Main/Settings/Settings";
import CreateStudOrganizations from "./Components/CreateStudOrganizations/CreateStudOrganizations";
import Rating from "./Components/Rating/Rating";
import {CallbackHandler} from "./Components/Auth/CallbackHandler";

const Navigator = lazy(() => import("./Components/Navigator/Navigator"));

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
            setGroupsList(tmp)
            setCompareList(prevState => [...prevState, group])
        }
    }



    useEffect(() => {
        checkId()
        const href = window.location.href.split('/')
        //console.log(href)
        const groupId = checkGroups("groupId2")
        const myGroup = checkGroups("my-group2")
        const domainArray = href.slice(0,3)

        // const myGroup = JSON.parse(localStorage.getItem("my-group"))

        if (myGroup && href.length===4) window.location.href = domainArray[0] + '//' + domainArray[2] + '/group/' + (myGroup?.university==='DGTU' ? myGroup.groupID : myGroup.name) + '?u=' + myGroup?.university
        else if (groupId && href.length===4) window.location.href = domainArray[0] + '//' + domainArray[2] + '/group/' + (myGroup?.university==='DGTU' ? myGroup.groupID : myGroup.name) + '?u=' + myGroup?.university

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
                <Message/>
                {isOffline && <div>offline</div>}
                { updateNewsShow && <ModalWindow setIsModalOpen={setUpdateNewsShow}/>}
                <Suspense fallback={<Loader2/>}>
                    <Routes>
                        {/*<Route element={}/>*/}
                        <Route path="/" element={<FavoritesNew />} />
                        {/*<Route path="/group/:groupId" element={<View addToCompare={addToCompare} isGroup={true} />} />*/}
                        {/*{settings?.viewType === "hor" ?*/}
                        {/*    <Route path="/group/:groupId" element={<View addToCompare={addToCompare} isGroup={true} />} />*/}
                        {/*    :*/}
                        {/*    <Route path="/group/:groupId" element={<ViewNew isMobile={isMobile} addToCompare={addToCompare} isGroup={true} />} />*/}
                        {/*}*/}
                        {/*<Route path="/group/:groupId" element={ <TechWorks />} />*/}
                        <Route path="/group/:groupId" element={<ViewNew isMobile={isMobile} addToCompare={addToCompare} isGroup={true} />} />
                        <Route path="/group/" element={<FavoritesNew />} />
                        <Route path="/room/:groupId" element={<View isRoom={true}/>} />
                        <Route path="/tasks/:groupId" element={<Tasks/>} />
                        <Route path="/tasks/" element={<Tasks/>} />
                        <Route path="/queue/:queueId" element={<Queue/>} />
                        <Route path="/queue/create/:subjectId" element={<CreateQueue/>} />
                        <Route path="/create/" element={<CreateSchedule/>} />
                        <Route path="/test/" element={<CreateTest/>} />
                        <Route path="/teacher/:groupId" element={<View isTeachers={true}/>} />
                        {/*<Route path="/favorites" element={<FavoritesNew />} />*/}
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/navigator/:audId" element={<Navigator />} />
                        <Route path="/story/:storyId" element={<StoryScreen />} />
                        <Route path="/compare/" element={<Compare2 compareList={compareList} groupsList={groupsList}/>} />
                        <Route path="/main/" element={<Main/>} />
                        <Route path="/profile/" element={<Personal/>} />
                        <Route path="/settings/" element={<Settings/>} />
                        <Route path="/create/studorg/" element={<CreateStudOrganizations/>} />
                        <Route path="/rating/" element={<Rating/>} />
                        <Route path="/auth/vk/callback" element={<CallbackHandler type={"vk"}/>} />
                        <Route path="/auth/ya/callback" element={<CallbackHandler type={"ya"}/>} />
                    </Routes>
                </Suspense>
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
