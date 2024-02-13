import {useEffect, useState} from "react";
import axios from "axios";
import {URLS} from "../../utils/urlsUtils";

export const AdminNew = () => {
    const [data, setData] = useState()

    useEffect(() => {
        const _data = {
            pwd: '123_admin_dark'
        }
        axios.post(URLS.GET_ALL_USERS, _data).then(res => {
            setData(res.data.data)
        })
    }, [])

    useEffect(() => {
        if (data) {
            let countFavorites = 0
            let countUserFavorites = 0
            let favoriteGroups = {}
            let favoriteFaculty = {}
            let favoriteUniver = {}

            data.forEach(user => {
                if (user.favoriteGroups && user.favoriteGroups.length > 0) {
                    countFavorites += user.favoriteGroups.length
                    countUserFavorites ++
                    user.favoriteGroups.forEach(gr => {
                        if (favoriteGroups[gr.name] > 0) favoriteGroups[gr.name]++
                        else favoriteGroups[gr.name] = 1

                        if (favoriteFaculty[gr.faculty] > 0) favoriteFaculty[gr.faculty]++
                        else favoriteFaculty[gr.faculty] = 1

                        if (favoriteUniver[gr.university] > 0) favoriteUniver[gr.university]++
                        else favoriteUniver[gr.university] = 1
                    })
                }
            })

            const favoriteGroupsArray = Object.entries(favoriteGroups);
            favoriteGroupsArray.sort((a, b) => b[1] - a[1]);

            const favoriteFacultyArray = Object.entries(favoriteFaculty);
            favoriteFacultyArray.sort((a, b) => b[1] - a[1]);

            console.log('countFavorites', countFavorites)
            console.log('countUserWithFavorites', countUserFavorites)
            console.log('countFavoritesFaculty', favoriteFacultyArray)
            console.log('countFavoritesGroups', favoriteGroupsArray)
            console.log('countFavoritesGroupsCount', Object.keys(favoriteGroups).length)
            console.log('countFavoritesUniver', favoriteUniver)
        }
        console.log(data)
    }, [data])

    return (
        <>
        </>
    )
}