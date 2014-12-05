
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var control = require('./routes/control');
var http = require('http');
var path = require('path');

var devMode = true;

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/controls', control.device);
app.get('/users', user.list);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
//
//app.listen(3000);
//console.log('Listening on port 3000');

var io = require('socket.io').listen(app.listen(app.get('port')));

if (devMode === true){
    var positions = ["red", "blue"];
} else{
    var positions = ["red-goal", "red-defence", "red-midfield", "red-attack", "blue-goal", "blue-defence", "blue-midfield", "blue-attack"];
};

var nodeConnectionCount = 0;

io.sockets.on('connection', function (socket) {
	var player = positions[nodeConnectionCount];	
    socket.emit('playerName', { message: player });
    if (nodeConnectionCount > 0){
    	nodeConnectionCount = 0;
    } else {    	
    	nodeConnectionCount++;
    }
    
    socket.on('move', function (moved, playerName) {
        io.sockets.emit('move', moved, playerName);
    });
    socket.on('kicked', function (kickSpeed, playerName) {
        io.sockets.emit('kicked', kickSpeed, playerName);
    });

    socket.on('switched', function (pos, playerName) {
        io.sockets.emit('switched', pos, playerName);
    });

    socket.on('start', function () {
        nodeConnectionCount = 0;
    });
    socket.on('kick', function (angle) {
        console.log(angle);
        var speed = 10;
        var radians = angle * (Math.PI/180)
        var vector = {};
        vector = {x: speed * Math.sin(radians), y: speed * Math.cos(radians)};
     //   switch(angle)
     //       {
     //           case 37:
     //             console.log("left");
     //             vector = {x: (speed * -1), y: 0};
     //             break;
     //           case 38:
     //             console.log("up");
     //             vector = {x: 0, y: (speed * -1)};
     //             break;
     //           case 39:
     //             console.log("right");
     //             vector = {x: speed, y: 0};
     //             break;
     //           case 40:
     //             console.log("down");
     //             vector = {x: 0, y: speed};
     //             break;
     //       } 
        io.sockets.emit('kick', vector);
    });
});
