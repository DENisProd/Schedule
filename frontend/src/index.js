import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ThemeProvider from "./providers/ThemeProvider";
import SettingsProvider from "./providers/SettingsProvider";
import {Provider} from "react-redux";
import {store} from "./store";
import ErrorBoundary from "./utils/ErrorBoundary";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <ThemeProvider>
            <Provider store={store}>
                <SettingsProvider>
                    <App/>
                </SettingsProvider>
            </Provider>
        </ThemeProvider>
    </ErrorBoundary>
);
