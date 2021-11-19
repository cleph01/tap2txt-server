require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pino = require("express-pino-logger")();
const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const server = express();
server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(pino);

server.post("/api/messages", (req, res) => {
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", "https://tap2txt-com.web.app/");

    const smsBody =
        req.body.message.body +
        " - Customer Cell #: " +
        req.body.message.customerCell;

    console.log("Incoming Body: ", req.body);

    client.messages
        .create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: req.body.message.rooferCell,
            body: smsBody,
        })
        .then(() => {
            res.send(JSON.stringify({ success: true }));
        })
        .catch((err) => {
            console.log(err);
            res.send(JSON.stringify({ success: false }));
        });
});

// watch for connections on port 5000
server.listen(process.env.PORT || 5000, () =>
    console.log("Server running on http://localhost:5000")
);
