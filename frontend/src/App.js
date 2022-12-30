import "./App.css";
import {useEffect} from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
//import "antd/dist/antd.css";
import View from "./Components/View";
import ViewRoom from "./Components/Views/ViewRoom";
import BottomMenu from "./Components/BottomMenu/BottomMenu";
import Favorites from "./Components/Favorites/Favorites";

function App() {
    useEffect(() => {
        window.addEventListener("offline", function () {
            alert("Отсутствует подключение к интернету");
        });
    }, []);

    return (
            <BrowserRouter>
                <Routes>
                    {/*<Route element={}/>*/}
                    <Route path="/" element={<Home />} />
                    <Route path="/group/:groupId" element={<View />} />
                    <Route path="/room/:roomId" element={<ViewRoom isRoom={true}/>} />
                    <Route path="/teacher/:roomId" element={<ViewRoom isTeachers={true}/>} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
                <BottomMenu />
            </BrowserRouter>
    );
}

export default App;
