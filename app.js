var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, resp) {
    resp.redirect('/static/index.html')
})


var server = app.listen(7001, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})