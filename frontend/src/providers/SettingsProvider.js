import React from 'react'
import { ThemeContext, themes } from '../contexts/ThemeContext'

export const SettingsContext = React.createContext({})

export const getSettings = () => {
    const settings = JSON.parse(localStorage.getItem('settings'))
    return {
        calDir: settings?.calDir === "top" ? "top" : "bottom"
    }
}

const SettingsProvider = ({ children }) => {
    const [ settings, setSettings ] = React.useState(getSettings)

    React.useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings))
    }, [ settings ])

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider