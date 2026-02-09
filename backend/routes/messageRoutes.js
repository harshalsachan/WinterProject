const express = require("express");
const router = express.Router();

const messageController = require("../controllers/Messagectrl");

router.post("/send", messageController.sendMessage);

router.post("/receive", messageController.receiveMessage);

module.exports = router;
