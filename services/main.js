//Import express
var express = require('express');
var ws = require("nodejs-websocket")
var ios1 = require('socket.io')();
var ios2 = require('socket.io')();

var app = express();

clients = []

app.get('/search', function (req, res) {
  res.json(clients)
});

//Start GUI Rest services
var server = app.listen(3334, function () {
  var host = server.address().address;
  var port = server.address().port;
});

var socketToId = {};
var idToSocket = {};

//Debug server connects here
ios1.on('connection', function(socket) {
  var id = guid();
  clients.push({
    name: "Chrome (localhost)",
    platform: "chrome",
    id: id,
  });

  socketToId[socket] = id;
  idToSocket[id] = socket;

  socket.on("disconnect", function() {
    var idx = -1;
    for (var i = 0; i < clients.length; ++i) {
      if (clients[i].id === socketToId[socket]) {
        idx = i;
        break;
      }
    }
    clients.splice(idx, 1);
  });
});
ios1.listen(9999);

function go() {
  console.log("SERVICES_STARTED");
}
setTimeout(go, 1000)

//GUI has selected a client
ios2.on('connection', function(socket) {
  //GUI notify of attach request
  socket.on("attach", function(info) {
    var id = info.id;
    var _socket = idToSocket[info.id];
    if (_socket === undefined) {
      console.error("Server could not locate socket with id: " + id);
    }

    _socket.emit("attach", {});

    //Received an if_dispatch request from the kernel (that was
    //intercepted from the going to the driver)
    _socket.on("if_dispatch", function(info) {
      var result_info = [];

      //We need to remove any messages that are if_event's to -333 (the debug pipe)
      //and redirect them to the websocket client as the message name for the event
      //name and the info is the message info
      //Iterate through priority queues
      for (var i = 0; i < info.length; ++i) {
        var result_priority = [];

        //Dump priority number
        result_priority.push(info[i].shift())

        while (info[i].length > 0) {
          var len = info[i].shift();
          var name = info[i].shift();
          var args = info[i].splice(0, len);

          //Debug event (-333)
          if (name === "if_event" && args[0] === -333) {
            args.shift(); //Remove -333
            var ename = args.shift(); //Get event name

            //Pass through debug event to controller
            socket.emit(ename, args[0]);
          } else {
            result_priority.push(len);
            result_priority.push(name);
            result_priority = result_priority.concat(args);
          }
        }

        result_info.push(result_priority);
      }

      _socket.emit("if_dispatch", result_info);
    });

    _socket.on("int_dispatch", function(info) {
      _socket.emit("int_dispatch", info)
    });

    socket.on("eval", function(info) {
      _socket.emit("int_dispatch", [1, "int_debug_eval", info.str]);
    });

    socket.on("fwd_int_event", function(info) {
      console.log("got fwd_int_event");
      _socket.emit("int_dispatch", [3, "int_event", info.bp, info.name, info.info]);
    });

    socket.on("int_debug_controller_describe", function(info) {
      _socket.emit("int_dispatch", [1, "int_debug_controller_describe", info.bp]);
    });

    socket.on("hierarchy", function(info) {
      _socket.emit("int_dispatch", [1, "int_debug_dump_ui", {}]);
    });

    socket.on("highlight", function(info) {
      var ptr = info.ptr;
      var on = info.on; //Bool true or false
      _socket.emit("if_dispatch", [[0, 2, "if_debug_highlight_view", ptr, on]]);
    });
  });
});
ios2.listen(4444);
