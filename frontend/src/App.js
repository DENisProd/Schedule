import "./App.css";
import {useEffect} from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import View from "./Components/View";
import BottomMenu from "./Components/BottomMenu/BottomMenu";
import Favorites from "./Components/Favorites/Favorites";
import Admin from "./Components/Admin/Admin";

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
                    <Route path="/group/:groupId" element={<View isGroup={true} />} />
                    <Route path="/room/:groupId" element={<View isRoom={true}/>} />
                    <Route path="/teacher/:groupId" element={<View isTeachers={true}/>} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
                <BottomMenu />
            </BrowserRouter>
    );
}

export default App;
