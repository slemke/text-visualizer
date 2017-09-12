const express = require('express')
const app = express()
const config = require('./config.js');

app.use('/assets', express.static(__dirname + '/assets'));
app.use(require('./modules'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(config.port, function () {
    console.log(`Example app listening on port ${config.port}!`);
});
