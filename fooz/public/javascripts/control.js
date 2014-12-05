window.onload = function() {


    var socket = io.connect(window.location.hostname);
    var mouseStart, mouseEnd, moved, pos, playerName, playerV, playerVAmt = 0, maxDispY = 0, startTime, endTime, timeDiff, startPos = "down";
 
    socket.on('playerName', function (resp) {
        playerName = resp.message;
        $(".player-name").html(resp.message);
    });

    
    $(".touch-area").on("mousedown touchstart", function(e){
        console.log(e);
        console.log(e.which);
        switch (e.which) {
            case 0:
                console.log(e.originalEvent);
                mouseStartX = e.originalEvent.pageX;
                mouseStartY = e.originalEvent.pageY;
                posx = mouseStartX;
                posy = mouseStartY;  
                console.log(posx);
                console.log(posy);
                $(".touch-area").on("touchmove", function(e){
                    e.preventDefault();
                    console.log(e);
                    movedx = e.originalEvent.pageX - posx;
                    posx = posx + movedx;
                    movedy = e.originalEvent.pageY - posy;
                    posy = posy + movedy;
                    playerVAmt = playerVAmt + movedy * -1;
                    console.log("PlayerAmt " + playerVAmt);

                    playerV = playerVAmt < 0 ? "up" : "down";

                    if (startPos != playerV){
                        console.log("SWITCHED");
                        startPos = playerV;
                        socket.emit('switched', playerV, playerName);
                    }
                    console.log(playerV);
                    console.log(posy);
                    console.log(movedy);

                    if (maxDispY > (playerVAmt * -1)){
                        maxDispY = maxDispY;                        
                    } else {
                        maxDispY = (playerVAmt * -1);
                        startTime = new Date();
                        console.log(startTime.getTime());
                    }
                    if (playerVAmt > -10 && maxDispY > 25){
                        console.log("KICKED");
                        endTime = new Date();
                        console.log(endTime.getTime());
                        timeDiff = endTime.getTime() - startTime.getTime();
                        console.log(timeDiff);
                        maxDispY = 0;
                        startPos = "down";
                        socket.emit('switched', startPos, playerName);
                        socket.emit('kicked', timeDiff, playerName);
                        $(".touch-area").off("touchmove");
                    } 
                    console.log("Max Disp " + maxDispY);
                    //console.log(movedy);
                    //console.log(movedx);
                    socket.emit('move', movedx, playerName);
                });
                break;          
            case 1:
                console.log(e.originalEvent);
                mouseStartX = e.clientX;
                mouseStartY = e.clientY;
                posx = mouseStartX;
                posy = mouseStartY;
                //console.log(mouseStart);
                $(".touch-area").on("mousemove touchmove", function(e){
                    //console.log(e.clientX);

                    console.log(e);

                    movedx = e.clientX - posx;
                    posx = posx + movedx;
                    movedy = e.clientY - posy;
                    posy = posy + movedy;
                    playerVAmt = playerVAmt + movedy * -1;
                    console.log("PlayerAmt " + playerVAmt);

                    playerV = playerVAmt < 0 ? "up" : "down";

                    if (startPos != playerV){
                        console.log("SWITCHED");
                        startPos = playerV;
                        socket.emit('switched', playerV, playerName);
                    }
                    console.log(playerV);
                    console.log(posy);
                    console.log(movedy);
                    if (maxDispY > (playerVAmt * -1)){
                        maxDispY = maxDispY;                        
                    } else {
                        maxDispY = (playerVAmt * -1);
                        startTime = new Date();
                        console.log(startTime.getTime());
                    }
                    if (playerVAmt > -10 && maxDispY > 25){
                        console.log("KICKED");
                        endTime = new Date();
                        console.log(endTime.getTime());
                        timeDiff = endTime.getTime() - startTime.getTime();
                        console.log(timeDiff);
                        maxDispY = 0;
                        startPos = "down";
                        socket.emit('switched', startPos, playerName);
                        socket.emit('kicked', timeDiff, playerName);
                        $(".touch-area").off("mousemove touchmove");
                    } 
                    console.log("Max Disp " + maxDispY);
                    //console.log(movedy);
                    //console.log(movedx);
                    socket.emit('move', movedx, playerName);
                    
                });
                break;
            case 2:
                console.log('Middle mouse button pressed');
                socket.emit('manKick');
                break;
            case 3:
                console.log('Right mouse button pressed');
                break;
            default:
                console.log('You have a strange mouse');
        }
        
    });

    $(".touch-area").on("mouseup touchend", function(e){
        switch (e.which) {
            case 0:                
            case 1:
                $(".touch-area").off("mousemove touchmove");
                playerVAmt = 0
                maxDispY = 0;
                break;
            case 2:
                console.log('Middle mouse button pressed');
                break;
            case 3:
                console.log('Right mouse button pressed');
                break;
            default:
                console.log('You have a strange mouse');
        }
        
    });
  
 
}