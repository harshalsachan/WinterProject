const express = require("express");

exports.sendMessage = (req, res, next) => {
  const { RoomID, message } = req.body;
  const gun = global.gun;

  try {
    gun.get("rooms").get(RoomID).get(Date.now().toString()).put({
      message: message,
      sentAt: Date.now(),
    });

    return res.json({ status: "success", message: "Message sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

exports.receiveMessage = (req, res, next) => {
  const { RoomID } = req.body;
  const gun = global.gun;

  let messages = [];

  try {
    return res.json({
      status: "success",
      info: "To get live messages, we should connect Gun in the frontend. API connected.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

exports.sendFiles = (req, res, next) => {
  res.json({ status: "File upload endpoint not ready yet" });
};
