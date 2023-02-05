export default function User({user}) {

    const parseUA = (() => {
        //useragent strings are just a set of phrases each optionally followed by a set of properties encapsulated in paretheses
        const part = /\s*([^\s/]+)(\/(\S+)|)(\s+\(([^)]+)\)|)/g;
        //these properties are delimited by semicolons
        const delim = /;\s*/;
        //the properties may be simple key-value pairs if;
        const single = [
            //it is a single comma separation,
            /^([^,]+),\s*([^,]+)$/,
            //it is a single space separation,
            /^(\S+)\s+(\S+)$/,
            //it is a single colon separation,
            /^([^:]+):([^:]+)$/,
            //it is a single slash separation
            /^([^/]+)\/([^/]+)$/,
            //or is a special string
            /^(.NET CLR|Windows)\s+(.+)$/
        ];
        //otherwise it is unparsable because everyone does it differently, looking at you iPhone
        const many = / +/;
        //oh yeah, bots like to use links
        const link = /^\+(.+)$/;

        const inner = (properties, property) => {
            let tmp;

            if (tmp = property.match(link)) {
                properties.link = tmp[1];
            }
            else if (tmp = single.reduce((match, regex) => (match || property.match(regex)), null)) {
                properties[tmp[1]] = tmp[2];
            }
            else if (many.test(property)) {
                if (!properties.properties)
                    properties.properties = [];
                properties.properties.push(property);
            }
            else {
                properties[property] = true;
            }

            return properties;
        };

        return (input) => {
            const output = {};
            for (let match; match = part.exec(input); '') {
                output[match[1]] = {
                    ...(match[5] && match[5].split(delim).reduce(inner, {})),
                    ...(match[3] && {version:match[3]})
                };
            }
            return output;
        };
    })();

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
          <td>{JSON.stringify(parseUA(user.userAgent).Mozilla)}</td>
          <td>{user.ipAdress}</td>  
          <td>{user.searchedGroups?.map(sg => ` ${sg}`)}</td>  
          <td>{user.favoriteGroups?.map(fg => ` ${fg}`)}</td>  
          <td>{user.enterCount}</td>  
          <td>{user?.created}</td>  
        </tr>
    )
}