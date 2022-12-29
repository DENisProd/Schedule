import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
//import "antd/dist/antd.css";
import View from "./Components/View";
import BottomMenu from "./Components/BottomMenu/BottomMenu";
import Favorites from "./Components/Favorites/Favorites";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/*<Route element={}/>*/}
                    <Route path="/" element={<Home/>}/>
                    <Route path="/group/:groupId" element={<View/>}/>
                    <Route path="/favorites" element={<Favorites/>}/>

                </Routes>
                <BottomMenu/>
            </BrowserRouter>


        </>
    );
}

export default App;
