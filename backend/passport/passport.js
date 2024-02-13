import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
import passport from "passport"
import VKontakteStrategy from "passport-vkontakte"
import YandexStrategy from "passport-yandex"
import Client from "../models/client.js";



// console.log(process.env)

passport.use(new VKontakteStrategy.Strategy({
        clientID: process.env.VKONTAKTE_APP_ID, // ID вашего приложения VK
        clientSecret: process.env.VKONTAKTE_APP_SECRET, // Секретный ключ вашего приложения VK
        // callbackURL: "http://localhost:3000/auth/vk/callback", // URL, на который будет производиться перенаправление после аутентификации VK
        callbackURL: "https://schedule.darksecrets.ru/auth/vk/callback", // URL, на который будет производиться перенаправление после аутентификации VK
    },
    async function(accessToken, refreshToken, params, profile, done) {
        try {
            let client = await Client.findOne({ vkontakteId: profile.id });
            if (!client) {
                // Если клиент не существует, создайте его
                client = new Client({
                    vkontakteId: profile.id,
                    displayName: profile.displayName,
                    username: profile.username,
                    photo: profile.photos[0].value || '',
                    // Другие данные клиента
                });

                await client.save();
            }

            // Генерируйте JWT и отправьте его клиенту
            //const token = jwt.sign({ clientId: client._id }, process.env.JWT_SECRET);
            const token = jwt.sign({ clientId: client._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            console.log(token)
            // return done({ accessToken: token, user: client })
            return done(null, { user: client, accessToken: token });
            // return done(null, JSON.stringify(client));

        } catch (error) {
            console.log(error)
            return done(error);
        }
    }
));

passport.use(
    new YandexStrategy.Strategy(
        {
            clientID: process.env.YANDEX_CLIENT_ID, // ID вашего приложения Yandex
            clientSecret: process.env.YANDEX_CLIENT_SECRET, // Секретный ключ вашего приложения Yandex
            callbackURL: "https://schedule.darksecrets.ru/auth/ya/callback", // URL, на который будет производиться перенаправление после аутентификации Yandex
            // callbackURL: "http://localhost:3000/auth/ya/callback", // URL, на который будет производиться перенаправление после аутентификации Yandex
        },
        async function (accessToken, refreshToken, profile, done) {
            try {
                let client = await Client.findOne({ vkontakteId: profile.id });
                if (!client) {
                    // Если клиент не существует, создайте его
                    client = new Client({
                        vkontakteId: profile.id,
                        displayName: (profile.name.familyName + ' ' + profile.name.givenName) || '',
                        username: profile.username,
                        photo: profile.photos[0].value || '',
                        // Другие данные клиента
                    });

                    await client.save();
                }

                // Генерируйте JWT и отправьте его клиенту
                // const token = jwt.sign({ clientId: client._id }, process.env.JWT_SECRET);
                const token = jwt.sign({ clientId: client._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
                // return done(JSON.stringify({ accessToken: token}));
                return done(null, { user: client, accessToken: token });

            } catch (error) {
                console.log(error)
                return done(error);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport