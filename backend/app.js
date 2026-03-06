const express = require('express');
const cors = require('cors');
const Gun = require('gun');

const roomRouter = require('./routes/roomRoutes');
const messRouter = require('./routes/messageRoutes');
const fileRouter = require('./routes/fileRoutes');

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/room', roomRouter);
app.use('/message', messRouter);
app.use('/file', fileRouter);

const PORT = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'awake', time: Date.now() });
});

const server = app.listen(PORT, () => {
  console.log('Server started on PORT:', PORT);
});

const gun = Gun({
  web: server,
  file: 'radata'
});

global.gun = gun;
console.log('Gun initialised');
