import dayjs from "dayjs";

export function groupByDateWithSubgroups (res) {
    let obj = getWeek(res.data.info.date.split("T")[0])
    // console.log(obj)
    let rasp1 = res.data.rasp
    for (let i = 0; i < rasp1.length; i++) {
        const raspDate = rasp1[i]["дата"].split("T")
        if (obj[raspDate[0]]?.length > 0) {
            if (
                rasp1[i]["номерЗанятия"] === rasp1[i - 1]["номерЗанятия"] &&
                rasp1[i - 1]["дата"].split("T")[0] === raspDate[0]
            ) {
                obj[raspDate[0]][obj[raspDate[0]].length - 1].push({
                    ...rasp1[i],
                    isPodgr: true,
                })
            } else {
                obj[raspDate[0]].push([
                    {
                        ...rasp1[i],
                        isPodgr: false,
                    },
                ])
            }
        } else {
            obj[raspDate[0]] = [];
            obj[raspDate[0]].push([
                {
                    ...rasp1[i],
                    isPodgr: false,
                },
            ])
        }
    }

    return {
        id: res.data.info.group.groupID,
        sked: obj,
        name: res.data.info.group.name,
        date: res.data.info.date.split("T")[0]
    }
}

export function getMondayOfWeek(date) {
    const monday = dayjs(date).startOf('week').add(1, 'day');
    const mondayString = monday.format('YYYY-MM-DD');

    return mondayString
}

export function getWeek(date) {
    const monday = dayjs(date).startOf('week')
    let week = {}
    let nextDay = monday
    // for (let i = 0; i < 9; i++) {
    //     week = {...week, [nextDay.format('YYYY-MM-DD')]: []}
    //     nextDay = nextDay.add(1, 'day')
    // }

    for (let i = 0; i < 7; i++) {
        nextDay = nextDay.add(1, 'day')
        week = {...week, [nextDay.format('YYYY-MM-DD')]: []}
    }

// console.log(week)
    return week
}