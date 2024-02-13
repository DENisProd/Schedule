import User from "../models/user.js";

import {v4} from 'uuid'
import UserService from "../services/userService.js";
const userService = new UserService()
import config from "config"

const SAVE_STATUSES = {
    STATS_SAVED: 1,
    SAVE_ERROR: 0
}

class UserController {
    getMe = async (req, res) => {
        try {
            const receivedClientId = req.body.clientId;

            console.log('clientID', receivedClientId)
            const existingClient = await userService.findUserByUid(receivedClientId)

            if (existingClient) {
                const { favoriteGroups, searchGroups } = req.body;
                console.log('fg', favoriteGroups);
                console.log('sg', searchGroups); // Добавляем вывод для отладки
              
                let saveStatus;
                let responseObject = {};
              
                if (Array.isArray(favoriteGroups)) {
                  favoriteGroups.forEach(_group => {
                    if (existingClient.favoriteGroups && !existingClient.favoriteGroups.includes(_group.id)) {
                      console.log('group is not saved');
                      existingClient.favoriteGroups.push(_group.id);
                    }
                  });
                  console.log(existingClient.favoriteGroups)
                }
              
                // Обработка searchGroups
                if (Array.isArray(searchGroups)) {
                    searchGroups.forEach(_group => {
                    if (existingClient.searchedGroups && !existingClient.searchedGroups.includes(_group.id)) {
                      console.log('search group is not saved');
                      existingClient.searchedGroups.push(_group.id);
                    }
                  });
                }
              
                // Сохранение изменений в базе данных
                try {
                    console.log('save')
                  await existingClient.save();
                  saveStatus = SAVE_STATUSES.STATS_SAVED;
                } catch (error) {
                  console.error('Error', error);
                  saveStatus = SAVE_STATUSES.SAVE_ERROR;
                }
              
                return res.status(200).json({ message: 'ok', clientId: req.body.clientId, saveStatus });
              } else {
                try {
                    const answer = await this.createUser(req, res)
                    return res.status(answer.status).json(answer.message)
                } catch (error) {
                    console.error('error', error)
                    return res.status(400).json({ message: 'Ошибка при сохранении данных' })
                }
            }
        } catch (e) {
            console.log(e)
            return res.status(404).json({message: 'Произошла ошибка при авторизации'})
        }
    }



    createUser = async (req, res) => {
        const newClientId = v4();

        // Получаем согласие пользователя на сбор данных (здесь можно реализовать логику для получения согласия от пользователя, например, через форму или чекбокс)
        const userConsent = true; // Здесь предполагается, что пользователь дал согласие

        // Если пользователь не дал согласие, не сохраняем его данные
        if (!userConsent) {
            return {
                status: 400,
                message: { message: 'Для продолжения работы необходимо дать согласие на сбор данных.' }
            };
        }

        // Получаем другие параметры клиента
        const language = req?.headers['accept-language'];
        const geolocation = req?.headers['x-forwarded-for'] || req?.connection.remoteAddress;
        const screenResolution = req?.headers['screen-resolution'];
        const deviceType = req?.headers['device-type'];
        const browser = req?.headers['user-agent'].split(') ')[0].split(' (')[1];
        const os = req?.headers['user-agent'].split(') ')[0].split(' (')[0];
        const referer = req?.headers['referer'] || '';
        const enterCount = req.body.enterCounts

        // Сохраняем данные клиента в MongoDB
        const clientData = new User({
            clientId: newClientId,
            ip: geolocation,
            userAgent: req?.headers['user-agent'],
            language,
            geolocation,
            screenResolution,
            deviceType,
            browser,
            os,
            referer,
            favoriteGroups: [],
            searchedGroups: [],
            authorized: true, // Здесь отмечаем, что данные сохранены с согласия пользователя
            enterCount,
        });

        // Используем промис для сохранения данных клиента
        return new Promise((resolve, reject) => {
            clientData.save((err) => {
                if (err) {
                    console.error('Ошибка при сохранении данных клиента:', err);
                    reject(err);
                } else {
                    console.log('Данные клиента успешно сохранены.');
                    resolve({
                        status: 201,
                        message: { message: 'Данные сохранены.', clientId: newClientId, maxAge: 900000 }
                    });
                }
            });
        });
    }

    updateUser = async (req, res) => {
        
    }

    getAllUsers = async (req, res) => {
        if (req.body.pwd === config.get("adminPassword")){
            const usersFromDb = await User.find({}).populate('favoriteGroups').exec()

            return res.status(200).json({success: "ok", data: usersFromDb})
        }

        return res.status(200).json({success: "false"})
    }
}

export default UserController