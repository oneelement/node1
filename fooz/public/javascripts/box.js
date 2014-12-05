window.onload = function() {

  var socket = io.connect(window.location.hostname);

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var canvas = document.getElementById("c");
  var ctx = canvas.getContext("2d"); // this is a canvas thing to draw 2d objects    
  var world;
  var canvaswidth = canvas.width-0;
  var canvasheight = canvas.height-0;

  var devMode = true;





  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;

  var radius = 70;

  var playerRadius = 15;

  var players, playerGroups;

  var SCALE = 30;

  var   b2Vec2 = Box2D.Common.Math.b2Vec2
          , b2BodyDef = Box2D.Dynamics.b2BodyDef
          , b2Body = Box2D.Dynamics.b2Body
          , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
          , b2Fixture = Box2D.Dynamics.b2Fixture
          , b2World = Box2D.Dynamics.b2World
          , b2MassData = Box2D.Collision.Shapes.b2MassData
          , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
          , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
          , b2DebugDraw = Box2D.Dynamics.b2DebugDraw;



   function init() {
         
       
         world = new b2World(
              new b2Vec2(0, 0)    //gravity
            ,  true                 //allow sleep
         );
         
         
       
         var fixDef = new b2FixtureDef;
         fixDef.density = 1.0;
         fixDef.friction = 1;
         fixDef.restitution = 1;
       
  //      var bodyDef = new b2BodyDef;
  //    
  //      //create ground
  //      bodyDef.type = b2Body.b2_staticBody;
  //      
  //      // positions the center of the object (not upper left!)
  //      bodyDef.position.x = canvas.width / 2 / SCALE;
  //      bodyDef.position.y = (canvas.height / SCALE) - 1;
  //      
  //      fixDef.shape = new b2PolygonShape;
  //      
  //      // half width, half height. eg actual height here is 1 unit
  //      fixDef.shape.SetAsBox((200 / SCALE) / 2, 1.5 / 2);
  //      world.CreateBody(bodyDef).CreateFixture(fixDef);

        //Draw Physics Boundaries

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(200 / 2 / SCALE, 40 / SCALE );
        
        bodyDef.position.Set(100 /  SCALE, 0);
        world.CreateBody(bodyDef).CreateFixture(fixDef);

        bodyDef.position.Set(480 / SCALE, 0);
        world.CreateBody(bodyDef).CreateFixture(fixDef);
        
        bodyDef.position.Set(100 / SCALE, canvasheight / SCALE);
        world.CreateBody(bodyDef).CreateFixture(fixDef);

        bodyDef.position.Set(480 / SCALE, canvasheight / SCALE);
        world.CreateBody(bodyDef).CreateFixture(fixDef);
        
        bodyDef.position.Set(0, canvasheight/2/ SCALE);                  
        fixDef.shape.SetAsBox(20 / SCALE,canvasheight / 2 / SCALE);        
        world.CreateBody(bodyDef).CreateFixture(fixDef);
        
        bodyDef.position.Set(canvaswidth / SCALE, canvasheight / 2 / SCALE);
        world.CreateBody(bodyDef).CreateFixture(fixDef);

          //  //Draw Goals
//
  //  ctx.beginPath();
  //  ctx.rect(200,0,180,40);
  //  ctx.fillStyle="#000000";
  //  ctx.fill();
//
  //  ctx.rect(200,980,180,40);
  //  ctx.fillStyle="#000000";
  //  ctx.fill();

        



        //DRAWING A POLYGON



    //    var bodyDef = new b2BodyDef;
    //    var fixDef = new b2FixtureDef;
    //    fixDef.density = 1.0;
    //    fixDef.friction = 1;
    //    fixDef.restitution = 0.2;
    //    bodyDef.type = b2Body.b2_staticBody;       
    //    //fixDef.shape = new b2CircleShape(40 / SCALE );
    //    var entity = {};
    //    var points = [];
    //    entity.points = [{x: 0, y: 0}, {x: 100, y: 0}, {x: 100, y:200}];
    //    for (var i = 0; i < entity.points.length; i++) {
    //        var vec = new b2Vec2(entity.points[i].x / SCALE, entity.points[i].y / SCALE);
//
    //        points[i] = vec;
    //    }
    //    fixDef.shape = new b2PolygonShape;
    //    fixDef.shape.SetAsArray(points, points.length);
    //    fixDef.shape.SetAsArray(points, points.length);
    //    bodyDef.position.Set(40 / SCALE, 40 / SCALE); 
    //    world.CreateBody(bodyDef).CreateFixture(fixDef);

        

        function addObject(object){
            //console.log(object.id);
            var bodyDef = new b2BodyDef;
            var fixDef = new b2FixtureDef;
            fixDef.density = 1.0;
            fixDef.friction = 1;
            fixDef.restitution = 0.2;
            if (object.type === "b2Body.b2_staticBody"){
                bodyDef.type = b2Body.b2_staticBody;
            } else {
                bodyDef.type = b2Body.b2_dynamicBody;
            }       
            bodyDef.userData = {};               
            bodyDef.userData.id = object.id;
            bodyDef.userData.parentid = object.parentId;
            bodyDef.userData.color = object.color;
            bodyDef.userData.radius = object.radius;
            bodyDef.userData.position = object.position;
            fixDef.shape = new b2CircleShape(object.radius / SCALE );
            bodyDef.position.Set(object.posx / SCALE, object.posy / SCALE);                       
            var entity = world.CreateBody(bodyDef).CreateFixture(fixDef);
            if (object.id === "ball"){
              world.ball = entity;
                entity.GetBody().ApplyImpulse(
                  new b2Vec2(8,1),
                    entity.GetBody().GetWorldCenter()
                );
            }
        }

        function addGroups(group){
          //console.log(group);
          var bodyDef = new b2BodyDef;
          var fixDef = new b2FixtureDef;
          fixDef.density = 1.0;
          fixDef.friction = 1;
          fixDef.restitution = 0.2;
          bodyDef.type = b2Body.b2_staticBody;      
          bodyDef.userData = {};               
          bodyDef.userData.id = group.id;
          bodyDef.userData.parentid = group.id;
          bodyDef.userData.color = group.color;
          bodyDef.userData.radius = playerRadius;
          bodyDef.userData.position = group.position;          
          bodyDef.position.Set(group.posx / SCALE, group.posy / SCALE);        
          //console.log(bodyDef);               
          var entity = world.CreateBody(bodyDef);
          for (var j = 0; j < group.players.length; j++) {
            //console.log(group.players[j]);
            fixDef.shape = new b2CircleShape(playerRadius / SCALE );
            //console.log(fixDef);
            pos = fixDef.shape.GetLocalPosition();
            //console.log(pos);
            pos.x = group.players[j].posx / SCALE;
            pos.y = group.players[j].posy / SCALE;
            //fixDef.shape.SetLocalPosition(group.players[j].posx / SCALE, group.players[j].posy / SCALE);
            //console.log(fixDef.shape);
            //console.log(playerGroups[i].players[j]);
            //addObject(playerGroups[i].players[j]);
            entity.CreateFixture(fixDef);
          }
        }

        playerGroups = [
          {id: "red-goal", parent: "red", changex: 0, color: "255, 0, 0", type: "b2Body.b2_staticBody", position: "down", posx: 290, posy: 940, width: 60, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "red-goal", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"}
          ]},
          {id: "red-defence", parent: "red", changex: 0, color: "255, 0, 0", position: "down", posx: 170, posy: 840, width: 300, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 240, posy: 0, color: "255, 0, 0"}
          ]},
          {id: "red-midfield", parent: "red", changex: 0, color: "255, 0, 0", position: "down", posx: 70, posy: 590, width: 300, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 110, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 220, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 330, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 440, posy: 0, color: "255, 0, 0"}
          ]},
          {id: "red-attack", parent: "red", changex: 0, color: "255, 0, 0", position: "down", posx: 120, posy: 310, width: 300, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "red-attack", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"},
            {id: "first", parentId: "red-attack", type: "b2Body.b2_staticBody", posx: 170, posy: 0, color: "255, 0, 0"},
            {id: "first", parentId: "red-attack", type: "b2Body.b2_staticBody", posx: 340, posy: 0, color: "255, 0, 0"}
          ]},
          {id: "blue-goal", parent: "blue", changex: 0, color: "0, 0, 255", type: "b2Body.b2_staticBody", position: "down", posx: 290, posy: 80, width: 60, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "red-goal", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"}
          ]},
          {id: "blue-defence", parent: "blue", changex: 0, color: "0, 0, 255", type: "b2Body.b2_staticBody", position: "down", posx: 170, posy: 180, width: 60, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 240, posy: 0, color: "255, 0, 0"}
          ]},
          {id: "blue-midfield", parent: "blue", changex: 0, color: "0, 0, 255", type: "b2Body.b2_staticBody", position: "down", posx: 70, posy: 430, width: 60, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 110, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 220, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 330, posy: 0, color: "255, 0, 0"},
            {id: "last", parentId: "red-defence", type: "b2Body.b2_staticBody", posx: 440, posy: 0, color: "255, 0, 0"}
          ]},
          {id: "blue-attack", parent: "blue", changex: 0, color: "0, 0, 255", type: "b2Body.b2_staticBody", position: "down", posx: 120, posy: 710, width: 60, kick: false, kickspeed: 0, players: [
            {id: "first", parentId: "blue-attack", type: "b2Body.b2_staticBody", posx: 0, posy: 0, color: "255, 0, 0"},
            {id: "first", parentId: "blue-attack", type: "b2Body.b2_staticBody", posx: 170, posy: 0, color: "255, 0, 0"},
            {id: "first", parentId: "blue-attack", type: "b2Body.b2_staticBody", posx: 340, posy: 0, color: "255, 0, 0"}
          ]},     
        ];

        players = [
          {id: "red-goal", type: "b2Body.b2_staticBody", posx: 100, posy: 100, radius: 30, changex: 50},
          {id: "red-defence", type: "b2Body.b2_staticBody", posx: 100, posy: 300, radius: 30, changex: 0}
        ];

        var initialBall = {id: "ball", parentId: "ball", type: "b2Body.b2_dynamicBody", posx: 0, posy: 470, radius: 15, color: "white"};

        
        for (var i = 0; i < playerGroups.length; i++) {
          //console.log(playerGroups[i]);
          addGroups(playerGroups[i]);
        }


        for (var i = 0; i < playerGroups.length; i++) {
          for (var j = 0; j < playerGroups[i].players.length; j++) {
            //console.log(playerGroups[i].players[j]);
            //addObject(playerGroups[i].players[j]);
          }
        }

        addObject(initialBall);

         var listener = new Box2D.Dynamics.b2ContactListener;
        listener.BeginContact = function(contact) {
          
            //console.log(contact.GetFixtureA().GetBody().GetUserData());
            //console.log(contact.GetFixtureB().GetBody().GetUserData());


            if (contact.GetFixtureA().GetBody().GetUserData()){
              //console.log(contact.GetFixtureA().GetBody().GetLinearVelocity());
              //console.log(contact.GetFixtureA().GetBody().GetLinearDamping());

              var damp = contact.GetFixtureB().GetBody();
              //console.log(damp.GetFixtureList().GetRestitution());
              damp.GetFixtureList().SetRestitution(1);
            }

       

        }
        listener.EndContact = function(contact) {
          
            //console.log(contact.GetFixtureA().GetBody().GetUserData());
            //console.log(contact.GetFixtureB().GetBody().GetUserData());
            if (contact.GetFixtureA().GetBody().GetUserData()){
              //console.log(contact.GetFixtureA().GetBody().GetFixtureList());
              //console.log(contact.GetFixtureA().GetBody().GetLinearVelocity());
              contact.GetFixtureA().GetBody().GetFixtureList().SetDensity(0);
              var damp = contact.GetFixtureB().GetBody();
              //console.log(damp.GetFixtureList().GetRestitution());
              damp.GetFixtureList().SetRestitution(0.2);
              var vel = contact.GetFixtureA().GetBody().GetLinearVelocity();
              console.log(vel);
              //console.log(vel.x);
              //console.log(Math.pow(vel.x, 2));
              //console.log(Math.pow(vel.y, 2));
              //console.log(Math.pow(vel.y, 2) + Math.pow(vel.x, 2));
              //console.log(Math.sqrt(Math.pow(vel.y, 2) + Math.pow(vel.x, 2)));
              var playerGroup = $.grep(playerGroups, function(e){ return e.id == contact.GetFixtureB().GetBody().GetUserData().parentid;});
              console.log(playerGroup[0]);
              if (playerGroup[0]){
                  console.log(playerGroup[0].kick);
                  if (playerGroup[0].kick == true){
                    var relVel = Math.sqrt(Math.pow(vel.y, 2) + Math.pow(vel.x, 2));
                    var factor = 13 / relVel;
                    vel.x = vel.x * factor * 1.5;
                    if (playerGroup[0].parent == "blue"){
                        vel.y = Math.abs(vel.y * factor * 2);
                    } else {
                        vel.y = -Math.abs(vel.y * factor * 2);
                    }
                    
                  }
              }
              

              
              //console.log(contact.GetFixtureA().GetBody().GetLinearVelocity());

              contact.GetFixtureA().GetBody().SetLinearDamping(0.02);
            }
        }
        listener.PostSolve = function(contact, impulse) {
            
        }
        listener.PreSolve = function(contact, oldManifold) {
          if (contact.GetFixtureA().GetBody().GetUserData()){
            var playerGroup = $.grep(playerGroups, function(e){ return e.id == contact.GetFixtureB().GetBody().GetUserData().parentid;});
            //console.log(contact.GetFixtureB().GetBody().GetUserData());
            //console.log(playerGroup);
            if (playerGroup[0]) {
              if (playerGroup[0].position == "up"){
                contact.SetEnabled(false);
              } else {
                contact.SetEnabled(true);
              }
            }
          }
          

            //contact.SetEnabled(false);
        }
        world.SetContactListener(listener);

        socket.on('move', function (moved, playerName) {
          if (devMode === true){
              var playerGroup = $.grep(playerGroups, function(e){ return e.parent == playerName;});
              //console.log(playerGroup[0].players);              
              for (var i = 0; i < playerGroup.length; i++) {
                playerGroup[i].changex = moved;
              }
          } else {
              var playerGroup = $.grep(playerGroups, function(e){ return e.id == playerName;});
              //console.log(playerGroup[0].players);
              playerGroup[0].changex = moved;
          }
            
  
                        
        });

        socket.on('switched', function (pos, playerName) {
            if (devMode === true){
                var playerGroup = $.grep(playerGroups, function(e){ return e.parent == playerName;});
                for (var i = 0; i < playerGroup.length; i++) {
                  playerGroup[i].position = pos;
                }
            } else {
                var playerGroup = $.grep(playerGroups, function(e){ return e.id == playerName;});
                //console.log(pos);
                playerGroup[0].position = pos; 
            }                       
        });

        socket.on('kicked', function (kickspeed, playerName) {
            if (devMode === true){
                var playerGroup = $.grep(playerGroups, function(e){ return e.parent == playerName;});
                for (var i = 0; i < playerGroup.length; i++) {
                  playerGroup[i].kick = true;
                  playerGroup[i].kickspeed = kickspeed;
                  (function(index) {
                      setTimeout(function(){
                        playerGroup[index].kick = false;
                      }, 800);
                  })(i);
                  
                }

            } else {
                var playerGroup = $.grep(playerGroups, function(e){ return e.id == playerName;});
                playerGroup[0].kick = true;
                playerGroup[0].kickspeed = kickspeed;
                setTimeout(function(){
                  playerGroup[0].kick = false;
                }, 800); 
            }
                  
        });

       
          //setup debug draw
         var debugDraw = new b2DebugDraw();
         debugDraw.SetSprite(document.getElementById("c").getContext("2d"));
         debugDraw.SetDrawScale(SCALE);
         debugDraw.SetFillAlpha(0.3);
         debugDraw.SetLineThickness(1.0);
         debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
         world.SetDebugDraw(debugDraw);
       
         // restart
         //setTimeout(init, 5000);
  }; // init()

  function drawPitch(){
    //Draw marking on pitch
    ctx.save();
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(290, 510, 125, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(20, 510);
    ctx.lineTo(560, 510);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(170, 40);
    ctx.lineTo(170, 140);
    ctx.lineTo(410, 140);
    ctx.lineTo(410, 40);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(170, 980);
    ctx.lineTo(170, 880);
    ctx.lineTo(410, 880);
    ctx.lineTo(410, 980);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    //Draw Table

  ctx.beginPath();
  ctx.rect(560,0,20,1020);
  ctx.fillStyle="#DEB887";
  ctx.fill();

  ctx.rect(0,0,20,1020);
  ctx.fillStyle="#DEB887";
  ctx.fill();

  ctx.rect(0,980,580,1020);
  ctx.fillStyle="#DEB887";
  ctx.fill();

  ctx.rect(0,0,580,40);
  ctx.fillStyle="#DEB887";
  ctx.fill();

  //Draw Goals

  ctx.beginPath();
  ctx.rect(200,0,180,40);
  ctx.fillStyle="#000000";
  ctx.fill();

  ctx.rect(200,980,180,40);
  ctx.fillStyle="#000000";
  ctx.fill();

 

  }

  $('.reset-ball').click(function(){
      resetBall();
  });

  $('.reset-game').click(function(){
      resetBall();
  });

  function resetBall(){
    console.log(world.ball);
    world.ball.GetBody().SetPosition(new b2Vec2(0 , 510 / SCALE));
    world.ball.GetBody().SetLinearVelocity(new b2Vec2(0,0), world.ball.GetBody().GetWorldCenter());
    console.log(world.ball);
    console.log(world.ball.GetBody());
    setTimeout(function(){
      var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      world.ball.GetBody().ApplyImpulse(new b2Vec2(8, 1 * plusOrMinus), world.ball.GetBody().GetWorldCenter());
    }, 2000); 
  }

  function goal(team){
    console.log(team + " team scored!!!");
    resetBall();
  }

  function checkGoal(pos){
    if (pos.y < (40 / SCALE)){
      goal("red");
      var score = parseInt($('.red-score .score-amt').html());
      console.log(score);
      score++;
      console.log(score);
      $('.red-score .score-amt').html(score)
    } else if (pos.y > (980 / SCALE )){
      goal("blue");
      var score = parseInt($('.blue-score .score-amt').html());
      console.log(score);
      score++;
      console.log(score);
      $('.blue-score .score-amt').html(score)
    }

  }



  function draw() {
    //console.log(world);
    //ctx.clearRect(0, 0, canvaswidth, canvasheight);

    drawPitch();

    for (var b = world.GetBodyList(); b; b = b.m_next) {
      if (b.IsActive() && typeof b.GetUserData() !== 'undefined' && b.GetUserData() != null) {
        //console.log(b);
        //console.log(b.GetUserData().id);
        //console.log(b.GetUserData());
        //console.log(b.GetPosition().x);
        //console.log(b.GetPosition().y);
        //console.log(b.GetWorldCenter().x);
        //console.log(b.GetWorldCenter().y);

        //console.log(b);       

        if (b.GetUserData().parentid != "ball"){
          var playerGroup = $.grep(playerGroups, function(e){ return e.id == b.GetUserData().parentid;});
          if (playerGroup[0].changex != 0){
              if (b.GetPosition().x >= (playerRadius / 2) / SCALE && b.GetPosition().x <= (540 - playerGroup[0].width + playerRadius) / SCALE) {
                b.SetPosition(new b2Vec2((b.GetPosition().x + (playerGroup[0].changex / SCALE)) , b.GetPosition().y));
              } else {
                if (b.GetPosition().x <= (playerRadius / 2) / SCALE){
                  b.SetPosition(new b2Vec2((30 / SCALE) , b.GetPosition().y));
                } else {
                  b.SetPosition(new b2Vec2(((540 - playerGroup[0].width + playerRadius) / SCALE) , b.GetPosition().y));
                }
                
              }             
              //playerGroup[0].changex = 0;
          }
        }

        if (b.GetUserData().parentid === "ball"){
          var imageObj = new Image();
          imageObj.src = '../images/Football.png';
          ctx.drawImage(imageObj, b.GetPosition().x * 30 - 15, b.GetPosition().y * 30 - 15);
          checkGoal(b.GetPosition());    
          
        } else {
          //ctx.clearRect(0, 0, canvaswidth, canvasheight);
          for (var f = b.GetFixtureList(); f; f = f.m_next) {
            ctx.save();
            ctx.strokeStyle = "#CCCCCC";
            if (playerGroup[0].position == "up"){
              ctx.fillStyle = "rgba(" + b.GetUserData().color + ", 0.5)";
            } else {
              ctx.fillStyle = "rgba(" + b.GetUserData().color + ", 1)";
            }          
            ctx.beginPath();
            ctx.arc((b.GetPosition().x * 30 + (f.m_shape.GetLocalPosition().x * 30)), (b.GetPosition().y * 30 + (f.m_shape.GetLocalPosition().y * 30)), playerRadius, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
          };
          
        }
        
      }
      
    }
    for (var i = 0; i < playerGroups.length; i++) {
      playerGroups[i].changex = 0;
    }
    //ctx.clearRect(0, 0, canvaswidth, canvasheight);
    
  }

  function update() {
     world.Step(
           1 / 60   //frame-rate
        ,  10       //velocity iterations
        ,  10       //position iterations
     );
     world.DrawDebugData();
     world.ClearForces();             

     draw();
     requestAnimFrame(update);
  }; // update()

  init();
  requestAnimFrame(update);

}