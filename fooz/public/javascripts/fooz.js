window.onload = function() {

    $(function() {
        $(".dial").knob();
        $(".range").rangeinput();
    });

    var socket = io.connect(window.location.hostname);
 
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame     ||
            window.webkitRequestAnimationFrame  ||
            window.mozRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    

    window.app = new function(){

        var me = {},
            $feedback = $('#feedback'),
            $document = $(document), 
            xBound = 540, 
            yBound = 940,
            ball = {},
            initialSpeed = 10,
            vector = {x: 0, y: 0};

        socket.on('kick', function (kickVector) {
            vector = kickVector;
        });

        socket.on('manKick', function () {
            console.log("man kicked");            
        });

        socket.on('move', function (moved, playerName) {
            console.log(playerName);
            var $man = $("." + playerName).find(".fooz-man-container");
            console.log($("." + playerName));
            console.log($man);
            console.log($man.innerWidth());
            var pos = parseInt($man.css("left").replace(/[^-\d\.]/g, ''));
            if (pos + moved < 0){
                $man.css({'left': '0px'});
            } else if ((pos + moved) > xBound - $man.innerWidth()){
                $man.css({'left': (xBound - $man.innerWidth()) + 'px'});
            } else {
                $man.css({'left': (pos + moved) + 'px'}); 
            }
            
        });

        $(".kick-button").click(function(){
            var angle = $('.dial').val();            
            calcVector(angle);
            socket.emit('kick', angle);
        });

        $(".start-game").click(function(){
            socket.emit('start');
        });

        $document.on('keypress', function(e){
            //37 = left, 38 = up, 39 = right, 40 = down
            //socket.emit('kick', e.keyCode);      
        });

        function addFriction(){
            vector.x = vector.x + ((vector.x * -1)/250);
            vector.y = vector.y + ((vector.y * -1)/250);
        }

        function calcVector(angle){
            console.log(angle);
            var radians = angle * (Math.PI/180);
            console.log(Math.sin(radians));
            console.log(Math.cos(radians));

        }

        function tick() {
            addFriction();
            ball.update(vector);
            requestAnimFrame(tick);
        }

        me.bounce = function (direction){
            vector[direction] *= -1;
        }

        me.init = function() {
            var new_pos = {x: 0, y: 0};
            ball = new Ball({
                pos: new_pos
            });
            $feedback.html(new_pos);
            tick();
        }

        return me;

    };

    function Ball(config) {

        var me = {},
            $me = $('<div class="ball" />'),
            cur_pos = config.pos,
            xBound = 540, 
            yBound = 940,
            ballSize = 20;

        function init() {
            $('.table').append($me);
        }

        function render(vector) {  
            checkBoundaries();
            checkCollision();         
            $me.css({
                //'-webkit-transform': 'translate3d(' + cur_pos.x  + 'px, ' + cur_pos.y + 'px, 0)'
                //'left': cur_pos.x + vector.x + 'px',
                //'top': cur_pos.y - vector.y + 'px'
                'transform': 'translate3d(' + (cur_pos.x + vector.x) + 'px, ' + (cur_pos.y - vector.y) + 'px, 0)',
                '-webkit-transform': 'translate3d(' + (cur_pos.x + vector.x) + 'px, ' + (cur_pos.y - vector.y) + 'px, 0)'
            });
            cur_pos.x += vector.x;
            cur_pos.y -= vector.y;
 
        }

        me.update = function(vector) {
            render(vector);
        }

        function checkCollision () {

        }

        function checkBoundaries() {
            if (cur_pos.x < 0 || cur_pos.x > (xBound - ballSize)){
                app.bounce('x');
            }
            if (cur_pos.y < 0 || cur_pos.y > (yBound - ballSize)){
                app.bounce('y');
            } 
        }

        init();

        return me;

    };

    app.init();
 
}