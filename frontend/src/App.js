import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Components/Home";
import CalendarComponent from "./Components/CalendarComponent";
import "antd/dist/antd.css";
import View from "./Components/View";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/group/:groupId" element={<View/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
