import {v4} from 'uuid'
import User from "../models/user.js";

export default function userMiddleware(req, res, next) {
    const clientId = req?.cookies.clientId;

    if (clientId) {
        // Клиент уже имеет уникальный id
        next();
    } else {
        // Генерируем новый уникальный id

    }
};