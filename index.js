var express = require("express");
var socket = require("socket.io");

// express app setup
var app = express();
var server = app.listen(process.env.PORT || 5000, function(){
    console.log("Connected");
});

app.use(express.static(__dirname + '/public'));

var users = [];
var connections = [];

// sockets
var io = socket(server);

io.on('connection', function(socket){
    connections.push(socket);
    console.log("Connected: %s socket(s) connected", connections.length);
    console.log("Made socket connection", socket.id);


    socket.on('new message', function(data){
        io.sockets.emit("new message", {msg: data, user: socket.username});
    });


    socket.on('typing', function(data){
        socket.broadcast.emit('typing', {msg: data, user: socket.username});
    });

     // Disconnect
     socket.on("disconnect", function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s socket(s) connected", connections.length);
    });


    // new user
    socket.on("new user", function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

});
