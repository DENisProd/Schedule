import UAParser from "ua-parser-js"

export default function User({user}) {

    const normalize = (value) => {
        if (value < 10) return "0" + value;
        else return value;
    };

    const getDateString = (currentDate) => {
        return `${currentDate.getUTCFullYear()}-${normalize(currentDate.getMonth() + 1)}-${normalize(currentDate.getDate())}`
    }

    const getDeviceString = (userAgent) => {
        let parser = new UAParser(userAgent)
        let parserResults = parser.getResult()
        return {
            os: parserResults.os,
            device: parserResults.device
        }
    }

    const getIconFromDeviceObject = (deviceObject) => {
        if (deviceObject.os.name === 'Windows') {
            return (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M22 2 11.2 3.6v8l10.8-.1V2zM10.2 12.5 2 12.4v6.8l8.1 1.1.1-7.8zM2 4.8v6.8h8.1V3.7L2 4.8zm9.1 7.7v7.9L22 22v-9.4l-10.9-.1z"/>
                    </svg>
                    <span>{deviceObject.device.vendor} {deviceObject.device.model}</span>
                </>
            )
        } else if (deviceObject.os.name === 'Android') {
            return (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24">
                        <path
                            d="M14.97535,3.01886l.95982-1.73159a.19342.19342,0,0,0-.33833-.18756l-.97045,1.75078a6.54141,6.54141,0,0,0-5.25275,0L8.40316,1.09971a.19342.19342,0,0,0-.33833.18756l.95985,1.7316A5.54614,5.54614,0,0,0,5.93152,7.89522h12.137A5.54615,5.54615,0,0,0,14.97535,3.01886ZM9.19911,5.67446a.5068.5068,0,1,1,.5068-.5068A.50737.50737,0,0,1,9.19911,5.67446Zm5.60178,0a.5068.5068,0,1,1,.5068-.5068A.50737.50737,0,0,1,14.80089,5.67446Zm-8.86946,11.497a1.46713,1.46713,0,0,0,1.46713,1.46713h.9736v3.00095a1.36046,1.36046,0,1,0,2.72091,0V18.63859h1.81386v3.00095a1.36046,1.36046,0,1,0,2.72091,0V18.63859h.97364a1.46713,1.46713,0,0,0,1.46713-1.46713V8.37532H5.93143ZM4.06415,8.14191A1.362,1.362,0,0,0,2.7037,9.50237v5.66846a1.36046,1.36046,0,1,0,2.72091,0V9.50237A1.362,1.362,0,0,0,4.06415,8.14191Zm15.8717,0a1.362,1.362,0,0,0-1.36046,1.36046v5.66846a1.36046,1.36046,0,1,0,2.72091,0V9.50237A1.362,1.362,0,0,0,19.93585,8.14191Z"/>
                    </svg>
                    <span>{deviceObject.device.vendor} {deviceObject.device.model}</span>
                </>
            )
        } else if (deviceObject.os.name === 'iOS') {
            return (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24">
                        <path
                            d="M14.94,5.19A4.38,4.38,0,0,0,16,2,4.44,4.44,0,0,0,13,3.52,4.17,4.17,0,0,0,12,6.61,3.69,3.69,0,0,0,14.94,5.19Zm2.52,7.44a4.51,4.51,0,0,1,2.16-3.81,4.66,4.66,0,0,0-3.66-2c-1.56-.16-3,.91-3.83.91s-2-.89-3.3-.87A4.92,4.92,0,0,0,4.69,9.39C2.93,12.45,4.24,17,6,19.47,6.8,20.68,7.8,22.05,9.12,22s1.75-.82,3.28-.82,2,.82,3.3.79,2.22-1.24,3.06-2.45a11,11,0,0,0,1.38-2.85A4.41,4.41,0,0,1,17.46,12.63Z"/>
                    </svg>
                    <span>{deviceObject.device.vendor} {deviceObject.device.model}</span>
                </>
            )
        }
    }

    return (
        <tr key={user["_id"]}>
            {/*<td>{user._id}</td>  */}
            <td>{getIconFromDeviceObject(getDeviceString(user.userAgent))}</td>
            <td>{user.ipAdress}</td>
            <td>{user.searchedGroups?.map(sg => ` ${sg}`)}</td>
            <td>{user.favoriteGroups?.map(fg => ` ${fg}`)}</td>
            <td>{user.enterCount}</td>
            <td>{user?.group}</td>
            <td>{user?.created.replace('Z','').split('T')[0]} {user?.created.replace('Z','').split('T')[1]}</td>
        </tr>
    )
}