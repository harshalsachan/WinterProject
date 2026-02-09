const express = require('express');
const router = express.Router();
const fileController = require('../controllers/Filectrl');

router.post('/upload', fileController.uploadFile);


router.get('/download/:fileId', fileController.getFile);

module.exports = router;

