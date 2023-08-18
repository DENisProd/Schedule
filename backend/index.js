import express from "express"
import mongoose from "mongoose"
import config from "config"
import cookieParser from 'cookie-parser';
import corsMiddleware from "./middleware/cors.middleware.js"
import requestIp from 'request-ip'
import morgan from 'morgan'
import https from 'https'

import groupRouter from "./routes/groupRoutes.js"
import CronController from "./controllers/cronController.js";

const app = express()
const PORT = config.get("serverPort")

import fs from 'fs'
import path from 'path'
import universityRoutes from "./routes/universityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import scheduleTimeRoutes from "./routes/scheduleTimeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import academicGroupRoutes from "./routes/academicGroupRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import subjectRouter from "./routes/subjectRouter.js";

app.use(requestIp.mw())
app.use(corsMiddleware)
app.use(express.json())

const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' });

// Create the file if it doesn't exist
accessLogStream.on('open', () => {
    console.log('Access log file opened successfully');
});

accessLogStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
        fs.mkdir(path.dirname(accessLogStream.path), (err) => {
            if (err) {
                console.error('Failed to create access log directory', err);
            } else {
                console.log('Access log directory created successfully');
                accessLogStream.end();

            }
        });
    } else {
        console.error('Failed to open access log file', err);
    }
});
function isTrustedIp(addr) {
    // replace this with your trusted IP addresses
    const trustedIps = ['10.0.0.1', '192.168.0.1'];

    return trustedIps.includes(addr);
}
const format = ':date[iso] :method :url :status - :response-time ms - :user-agent';
// Use morgan with the write stream
app.use(morgan(format, {
    stream: accessLogStream
}));

const parseIp = (req) => req.headers['x-forwarded-for'] || req.socket.remoteAddress

// Trust the first proxy in front of your application
app.set('trust proxy', 1);

app.use("/group", groupRouter)
app.use("/universities", universityRoutes)
app.use("/user", userRoutes)
app.use("/time_shedule", scheduleTimeRoutes)
app.use('', adminRoutes)
app.use('/groups', academicGroupRoutes)
app.use('/queue', queueRoutes)
app.use('/subject', subjectRouter)


app.get('/', (req, res) => {
    res.send('Hello, HTTPS!');
});


const options = {
    key: fs.readFileSync('./cert/localhost/localhost.decrypted.key'),
    cert: fs.readFileSync('./cert/localhost/localhost.crt')
};

const start = async () => {
    try {
        // Подключение к MongoDB с обработкой ошибок
        mongoose.set('strictQuery', false);
        await mongoose.connect(config.get("dbUrl"), {
            useNewUrlParser: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return;
    }

    // Создание и запуск HTTPS-сервера с обработкой ошибок
    // const server = https.createServer(options, app);
    // https.globalAgent.options.ca = rootCas;
    try {
        await app.listen(PORT);
        console.log("Server started on port", PORT);
    } catch (error) {
        console.error("Error starting the server:", error);
        return;
    }

    // Инициализация CronController
    const cron = new CronController();
    cron.init();

    // Обработка необработанных исключений и отображение ошибок
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection:', reason);
    });
};

start()
