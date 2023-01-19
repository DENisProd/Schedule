export default function User({user}) {

    const normalize = (value) => {
        if (value < 10) return "0" + value;
        else return value;
    };

    const getDateString = (currentDate) => {
        return `${currentDate.getUTCFullYear()}-${normalize(currentDate.getMonth() + 1)}-${normalize(currentDate.getDate())}`
    }

    return (
        <tr key={user._id}>
          <td>{user._id}</td>  
          <td>{user.userAgent.replace("(KHTML, like Gecko)","").replace("AppleWebKit/","")}</td>  
          <td>{user.ipAdress}</td>  
          <td>{user.searchedGroups?.map(sg => ` ${sg}`)}</td>  
          <td>{user.favoriteGroups?.map(fg => ` ${fg}`)}</td>  
          <td>{user.enterCount}</td>  
          <td>{user?.created}</td>  
        </tr>
    )
}