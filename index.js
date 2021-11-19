const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const pino = require("express-pino-logger")();
const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(pino);

server.get("/", (req, res) => {
    res.send("This is the Demo page for" + " setting up express server !");
});

server.post("/api/messages", (req, res) => {
    // res.header("Access-Control-Allow-Origin", "https://tap2txt-com.web.app/");

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
