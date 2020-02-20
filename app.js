var express = require('express');
var logger = require('morgan');
let dotenv = require('dotenv').config()
const {PORT = 9001, HOSTNAME = 'localhost'} = process.env
var database = require('./routes/database');
var getDataFromAPI = require('./routes/movies');

var routes = require('./routes/routes');

var app = express();

if (database.totalCount() < 100) {
    getDataFromAPI()
}

app.use(express.json());
app.use('/api/muvis', routes);

app.listen (PORT, function() {
    console.log(`Server listening on http://${HOSTNAME}:${PORT}`)
})



module.exports = app;
