var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
    var clientId = socket.handshake.headers['x-clientid'];
    var clientName = socket.handshake.headers['x-clientname'];

    // deal with chat information
    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', clientName+': '+msg);
    });

    // broadcast logout message
    socket.on('disconnect', function() {
        io.emit('chat message', clientName + ' leaves the chat home!');
    });

    // broadcast login message
    io.emit('chat message', clientName + ' comes to the chat home!')

    // broadcast typing condition
    socket.on('open typing', function() {
        socket.broadcast.emit('open typing', clientName, clientId);
    });

    socket.on('close typing', function() {
        socket.broadcast.emit('close typing', clientName, clientId);
    });

    // add online people
    socket.on('login', function() {
        socket.broadcast.emit('login', clientName, clientId);
    })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
