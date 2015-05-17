//Import express
var express = require('express');
var app = express();

app.get('/search', function (req, res) {
  res.json([ { name: "Chrome (localhost)", platform: "chrome"}])
});

var guiPort = process.env.GUI_PORT || 3333;
var server = app.listen(guiPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
