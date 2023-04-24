import fetch from "node-fetch";
import dayjs from "dayjs";
import * as cheerio from 'cheerio';

class RsueService {
    async fetchGroup(URL, groupId, date) {
        console.log(URL + groupId)
        const response = await fetch(URL + groupId + "&sdate=" + (date || dayjs().format('YYYY-MM-DD')));
        return await response.json()
    }

    async getCurses (facultyId) {

    }

     uuid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    async parseSchedule(facultyId, kursId, groupId) {
        const formData = new FormData();
        formData.append('f', facultyId);
        formData.append('k', kursId);
        formData.append('g', groupId);
        formData.append('uuid', this.uuid(groupId));

        const options = {
            method: 'POST',
            body: formData
        };

        const response = await fetch('https://rsue.ru/raspisanie/', options)
            .then(res => res.text())
            .then(data => {
                const $ = cheerio.load(data);
                const container = $('.container').last()
                const groupName = container.find('h1').first().text().replace('Группа ','')
                const oddWeek = container.find('.row').first().children()
                const evenWeek = container.children('.row').last().children().toArray()
                console.log('odd', oddWeek.length)
                console.log('even ',evenWeek.toString())
                console.log("=============")
                let arr = []
                evenWeek.forEach(e => {
                    const cont = cheerio.load(e)
                    const dayName = cont('div').children().first().text()
                    const subjects = []
                    const subjectsHtml = cont('div').children().first().nextAll().toArray()
                    console.log(dayName)
                    subjectsHtml.forEach(subj => {
                        const shtml = cheerio.load(subj)
                        const bottomBlock = shtml('div').children()
                        const subjectObject = {
                            time: shtml('div').children().first().children('span').text(),
                            name: shtml('div').children().first().next().children('span').text(),
                            teacher: shtml('div').children().first().next().next().children('span').text(),
                            room: bottomBlock.children('.aud').text(),
                            type: bottomBlock.children('.type').text(),
                        }
                        subjects.push(subjectObject)
                        // console.log('push')
                    })
                    // console.log(subjects)
                    // console.log(subjectsHtml.toString())
                    arr.push({dayName, subjects})
                })
                console.log(arr)
                // console.log(container.toString())
                return {groupName,arr}
            });
        console.log(response)
        return response
    }
}

export default RsueService