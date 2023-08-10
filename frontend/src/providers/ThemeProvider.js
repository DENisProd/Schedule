import React from 'react'
import { ThemeContext, themes } from '../contexts/ThemeContext'

export const getTheme = () => {
    const theme = `${window?.localStorage?.getItem('theme')}`
    if (Object.values(themes).includes(theme)) return theme

    let userMedia = window.matchMedia('(prefers-color-scheme: light)')
    if (userMedia.matches) return themes.light

    userMedia = window.matchMedia('(prefers-color-scheme: pink)')
    if (userMedia.matches) return themes.pink

    userMedia = window.matchMedia('(prefers-color-scheme: yellow)')
    if (userMedia.matches) return themes.yellow

    return themes.dark
}

function updateManifest() {
    // Get the manifest element in the head section of the document
    const manifest = document.querySelector('link[rel="manifest"]');

// Parse the manifest JSON data
    fetch(manifest.href)
        .then(response => response.json())
        .then(data => {
            // Update the theme_color property
            data.theme_color = '#ff0000';

            // Convert the updated JSON data to a string
            const updatedManifest = JSON.stringify(data);

            // Update the manifest file with the new data
            fetch(manifest.href, {
                method: 'PUT',
                body: updatedManifest,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        });
}

function newColor(theme) {

// Find the HTML head element
    const head = document.getElementsByTagName('head')[0];

// Create a new meta tag for the theme color
    let color = "#F4F6F8"
    if (themes.dark===theme) color = "#26272E"
    if (themes.pink===theme) color = "#ff7676"
    if (themes.yellow===theme) color = "#ff7676"

    const themeColorMeta = document.createElement('meta');
    themeColorMeta.setAttribute('name', 'theme-color');
    themeColorMeta.setAttribute('content', color);

// Remove any existing theme-color meta tags
    const existingThemeColorMeta = head.querySelector('meta[name="theme-color"]');
    if (existingThemeColorMeta) {
        head.removeChild(existingThemeColorMeta);
    }

// Add the new theme-color meta tag to the head
    head.appendChild(themeColorMeta);
}

function changeThemeColor(theme) {
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    metaThemeColor.setAttribute("content", themes.light===theme ? "#F4F6F8" : "#3A3D41");
    setTimeout(function() {
        changeThemeColor();
    }, 3000);
}

const ThemeProvider = ({ children }) => {
    const [ theme, setTheme ] = React.useState(getTheme)

    React.useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem('theme', theme)
        // changeThemeColor(theme)
        // updateManifest()
        newColor(theme)
    }, [ theme ])

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider