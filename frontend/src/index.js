import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from "./providers/ThemeProvider";
import SettingsProvider from "./providers/SettingsProvider";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </ThemeProvider>
);
