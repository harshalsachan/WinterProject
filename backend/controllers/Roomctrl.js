const express = require("express");

exports.createRoom = (req, res, next) => {
    const RoomID = Math.random().toString(36).substring(2, 8).toUpperCase();

    console.log("Created Room:", RoomID);

    const gun = global.gun;

    gun.get("rooms").get(RoomID).put({ createdAt: Date.now() });

    res.status(201).json({
        success: true,
        RoomID: RoomID,
    });
};

exports.joinRoom = (req, res) => {
    const { RoomID, username } = req.body;
    const gun = global.gun;

    console.log(`🔍 Checking if room ${RoomID} exists...`);

    gun
        .get("rooms")
        .get(RoomID)
        .once((roomData) => {
            if (roomData && roomData.createdAt) {
                console.log(`✅ Room found: ${RoomID}`);
                res.json({
                    success: true,
                    RoomID: RoomID,
                });
            } else {
                console.log(`❌ Room NOT found: ${RoomID}`);

                res.status(404).json({
                    success: false,
                    message: "Room does not exist! Please check the code.",
                });
            }
        });
};
