var express = require('express');
var app = express();

app.get('/search', function (req, res) {
  res.json([ { name: "Chrome (localhost)", platform: "chrome"}])
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
