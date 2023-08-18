import User from "../models/user.js";

import {v4} from 'uuid'

class UserController {
    getMe = async (req, res) => {
        try {
            const receivedClientId = req.body.clientId;

            const existingClient = await User.findOne({clientId: receivedClientId});

            if (existingClient) return res.status(200).json({message: 'ok', clientId: req.body.clientId});
            else {
                try {
                    const answer = await this.createUser(req, res);
                    return res.status(answer.status).json(answer.message);
                } catch (error) {
                    console.error(error);
                    return res.status(400).json({ message: 'Ошибка при сохранении данных' });
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
            authorized: true, // Здесь отмечаем, что данные сохранены с согласия пользователя
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
}

export default UserController