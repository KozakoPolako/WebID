const express = require('express');
const cors = require('cors');
const app = express();

const dokuments = require ('./api/routes/dokuments')

app.use(cors());
app.use('/dokuments', dokuments);

module.exports = app;
