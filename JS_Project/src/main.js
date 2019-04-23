/*
    Noah Gershmel, Jack Hawblitzel, Elysse Kimmel
    WebGL Program using an FPS camera with speed of time controlled by alpha waves from OpenBCI
*/

//Global variables to hold webGL objects
var canvas;
var scRatio = 1;
var gl;
var locked = false;
var scoreboard;
var relaxValue;
var shootAudio, impactAudio, reloadAudio;

//Uniform IDs
var model_id;
var normal_id;
var view;
var perspective_id;
var color_id;
var lightPos_id;
//Attribute locations
var vPosition;
var vNormal;
//Shader Program
var vProgram;
//View and perspective matrices
var sensitivity = 0.2;
var mX = 0.0;
var mY = 0.0;
var camPos = vec3(0.0,0.2,0.0);
var camDir = vec3(0.0,0.0,-1.0);
var perspMat = perspective(70, 1, 0.1, 48.0);

//Game Data
var points = 0;
var gameOver = false;

//Time Control
var lastTime;
var deltaTime;
var scaledTime;
var paused = true;
var timeSpeed = 1.0; 
var timeSinceLastLaunch = 0.0; //Tracking variable for fire rate
var reloadTracker = 999.0;

//Enemy Basic Data
var enemySpeed = 2.0;
var enemySpawnRate = 0.7;
var timeSinceLastSpawn = 10.0;

//Global data
var objectList = [];
var lightPositions = [];

//Setup on load
window.onload = function init() {
    canvas = document.getElementById("gl-canvas"); //Get canvas from html
    canvas.width = getWidth()-128;
    canvas.height = getHeight()-128;
    scRatio = canvas.width / canvas.height;

    scoreboard = document.getElementById("score");
    shootAudio = document.getElementById("shoot");
    shootAudio.volume = 0.3;
    impactAudio = document.getElementById("impact");
    reloadAudio = document.getElementById("reload");
    reloadAudio.volume = 0.35;
    relaxValue = document.getElementById("relaxation");

    //Pointer locking
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
    //Handles pointer lock and launching of projectiles on mouse click
    canvas.onclick = function() {
        if (locked) {
            //Check if enough time has passed to allow for a new ball to be launched
            if (timeSinceLastLaunch > 1.0) {
                var newProjectile = buildProjectile(1);
                newProjectile.scale = vec3(0.2, 0.2, 0.2);
                newProjectile.position = camDir;
                newProjectile.rotation = camDir;
                newProjectile.velocity = scale(25.0, camDir);
                newProjectile.color = vec3(1,1,1);
                objectList.push(newProjectile);
                shootAudio.play();
                reloadTracker = 1.0;
                timeSinceLastLaunch = 0.0;
            }

        }
        canvas.requestPointerLock();
    };

    gl = WebGLUtils.setupWebGL(canvas);	//Get gl context from Common directory
    if ( !gl ) { alert( "WebGL failed to load" ); }	//Error handle when WebGL fails

    gl.viewport(0, 0, canvas.width, canvas.height);	//Set the viewport equal to the canvas
    gl.clearColor(0.7, 1.0, 1.0, 1.0);	//Set the clear color to white
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST); //Turns on depth testing
    gl.depthFunc(gl.LESS);

    vProgram = initShaders(gl, "vertex-shader", "fragment-shader");	//Compile the shader program
    gl.useProgram(vProgram);	//Activate the shader program

    //Get uniform variable locations in the shader program
    model_id = gl.getUniformLocation( vProgram, "modelMat" );
    normal_id = gl.getUniformLocation(vProgram, "normalMat");
    view = gl.getUniformLocation(vProgram, "view");
    perspective_id = gl.getUniformLocation(vProgram, "perspective");
    lightPos_id = gl.getUniformLocation( vProgram, "lightPos");
    color_id = gl.getUniformLocation(vProgram, 'colorIn');
    vPosition = gl.getAttribLocation(vProgram, "vPosition");
    vNormal = gl.getAttribLocation( vProgram, "vNormal" ); 

    fac_vPosition = vPosition;
    fac_vNormal = vNormal;

    objectList.push(buildCube(0));
    objectList[0].position = subtract(objectList[0].position, vec3(0.0,32.0,0.0));
    objectList[0].scale = vec3(30,30,30);
    objectList[0].color = vec3(0,1,0);

    lastTime = Date.now();
    mainLoop();
}

//Runs continuously and handles per frame function calls
function mainLoop(){
    //Handle time calculations
    deltaTime = (Date.now() - lastTime) / 1000.0;
    lastTime = Date.now();
    if (paused) {
        deltaTime = 0.0;
    }
    scaledTime = deltaTime * timeSpeed;
    timeSinceLastLaunch += deltaTime;
    timeSinceLastSpawn += deltaTime;
    reloadTracker -= deltaTime;

    if (reloadTracker < 0.4) {
        reloadAudio.play();
        reloadTracker = 999.0;
    }
    timeSpeed = 1.0 - getDifficulty();
    if (isNaN(timeSpeed)) {
        timeSpeed = 1.0;
    }
    relaxValue.innerHTML = timeSpeed;
    updateEnemies();
    updatePhysics();
    calculateCollisions();
    pruneObjectList();
    render();
    
    if (!gameOver) {
        requestAnimationFrame(mainLoop);
    }
}

//Updates spawned enemy positions and spawns new enemies if necessary
function updateEnemies(){
    for (i=0; i<objectList.length; i++) {
        //2 for enemies
        if (objectList[i].type_id == 2){
            var deltaPos = scale(scaledTime * enemySpeed, normalize( subtract(vec3(0,0,0), objectList[i].position) ) );
            objectList[i].position = add(objectList[i].position, deltaPos);
        }
    }
    if (timeSinceLastSpawn > (1.0 / enemySpawnRate)) {
        spawnEnemy();
        timeSinceLastSpawn = 0.0;
    }
}

//Updates the position of all objects using physics
function updatePhysics(){
    var counter = 0;
    refreshLightPositions();
    for (i=0; i<objectList.length; i++) {
        //1 for projectiles
        if (objectList[i].type_id == 1 || objectList[i].type_id == 3) {
            //Calculate the change in position
            var deltaPos = scale(deltaTime, add( objectList[i].velocity , scale(deltaTime*0.5, vec3(0,-9.8,0))) );
            //console.log(deltaPos[0], deltaPos[1], deltaPos[2]);
            objectList[i].position = add(objectList[i].position, deltaPos);
            objectList[i].velocity = add(objectList[i].velocity, scale(deltaTime, vec3(0,-9.8,0)));
            if (objectList[i].type_id == 1 && counter < 4) {
                lightPositions[counter] = vec4(objectList[i].position[0], objectList[i].position[1], objectList[i].position[2], 10.0);
            }
        }
    }
}

//Calculate collisions / points / delete objects
function calculateCollisions(){
    for (i=0; i<objectList.length; i++) {
        //1 for projectiles
        if (objectList[i].type_id == 1) {
            //Calculate the change in position
            if (objectList[i].position[1] < -2) {
                objectList[i].alive = false;
            }
            for (j=0; j<objectList.length; j++) {
                if (objectList[j].type_id == 2) {
                    if ( length( subtract( objectList[i].position, objectList[j].position) ) < 1.1 ){
                        points++;
                        scoreboard.innerHTML = points;
                        objectList[i].alive = false;
                        objectList[j].alive = false;
                        break;
                    }
                }
            }
        }
        //2 for enemies
        else if (objectList[i].type_id == 2){
            if (length( subtract( objectList[i].position, vec3(0,0,0)) ) < 2.0) {
                timeSpeed = 0.0;
                scoreboard.innerHTML = "Game Over! Your score was: " + points;
                gameOver = true;
                document.exitPointerLock();
            }
        }
        //3 for shrapnel
        else if (objectList[i].type_id == 3) {
            if (objectList[i].position[1] < -2) {
                objectList[i].alive = false;
            }
        }
    }
}

//Removes dead objects from the list
function pruneObjectList(){
    var nList = [];
    for (i = 0; i <objectList.length; i++) {
        if (objectList[i].alive == true) {
            nList.push(objectList[i]);
        } else if (objectList[i].type_id == 2) {
            impactAudio.play();

            //Spawn explosion of particles
            for (j = 0; j<8; j++) {
                var particle = buildShrapnel(3);
                particle.scale = vec3(0.35, 0.35, 0.35);
                particle.rotation = vec3(getRandNegToOne() * 90, getRandNegToOne()*90, getRandNegToOne()*90);
                particle.color = vec3(0.1,0.1,0.1);
                var pPos = vec3 (getRandNegToOne(), getRandNegToOne(), getRandNegToOne());
                particle.position = add( objectList[i].position, pPos );
                particle.velocity = scale(4.0, normalize(pPos) );
                nList.push(particle);
            }
            for (j = 0; j<6; j++) {
                var particle = buildFire(3);
                particle.scale = vec3(0.2, 0.2, 0.2);
                particle.rotation = vec3(getRandNegToOne() * 90, getRandNegToOne()*90, getRandNegToOne()*90);
                particle.color = vec3(0.8,0.1,0.1);
                var pPos = vec3 (getRandNegToOne(), getRandNegToOne(), getRandNegToOne());
                particle.position = add( objectList[i].position, pPos );
                particle.velocity = scale(12.0, normalize(pPos) );
                nList.push(particle);
            }
        }
    }
    objectList = nList;
}

//Spawns an enemy on a hemisphere around the player
function spawnEnemy(){
    var newEnemy = buildSphere(2);
    var ePos = vec3(getRandNegToOne(), Math.random(), getRandNegToOne());
    newEnemy.position = scale(30.0, normalize(ePos) );
    newEnemy.color = vec3(1,0,0);
    objectList.push(newEnemy);
}

//Renders all objects in scene
function render(){
    //Clear the canvas
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    var viewMat = mult(mult(rotate(-mY, vec3(1,0,0)), rotate(-mX, vec3(0,1,0))), scalem(0.5, 0.5 * scRatio, -0.5) );
    gl.uniformMatrix4fv(view, gl.TRUE, flatten(viewMat));
    gl.uniformMatrix4fv(perspective_id, gl.TRUE, flatten(perspMat));
    //Render each object in the master list
    for (i=0; i<objectList.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, objectList[i].vBuffer); 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectList[i].iBuffer);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 32, 0);
        gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 32, 16 );

        gl.uniform3fv(color_id, flatten(objectList[i].color));
        gl.uniform4fv(lightPos_id, flatten(lightPositions));
        var t = getTransform(objectList[i].position, objectList[i].rotation, objectList[i].scale);
        gl.uniformMatrix4fv(model_id, gl.TRUE, flatten( t ));
        gl.uniformMatrix4fv(normal_id, gl.TRUE, flatten( normalMatrix(t) ));
        gl.drawElements(gl.TRIANGLES, objectList[i].indexCount, gl.UNSIGNED_SHORT, 0);
    }
}

//Returns a transformation matrix from a position, rotation, and scale
function getTransform(t, r, s) {
    var mat = scalem(s[0], s[1], s[2]);
    mat = mult (rotate(r[0], vec3(1,0,0)),mat );
    mat = mult (rotate(r[1], vec3(0,1,0)),mat );
    mat = mult (rotate(r[2], vec3(0,0,1)),mat );
    mat = mult (translate(t[0], t[1], t[2]),mat );
    return mat;
}

//From Mozilla documentation: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      locked = true;
      paused = false;
      document.addEventListener("mousemove", updatePosition, false);
    } else {
      locked = false;
      paused = true;
      document.removeEventListener("mousemove", updatePosition, false);
    }
}

//Updates the camera rotation based on the mouse movement
function updatePosition(e) {
    mX -= e.movementX * sensitivity;
    mY -= e.movementY * sensitivity;
    var xRot = rotate(-mX, vec3(0,1,0));
    var yRot = rotate(-mY, vec3(1,0,0));

    camDir = applyMatrix(vec3(0,0,1), mult(xRot, yRot));
}

//Sets all the lights to an unreachable value
function refreshLightPositions(){
    lightPositions = [
        vec4(0, 0, 0, 0),
        vec4(0, 0, 0, 0),
        vec4(0, 0, 0, 0),
        vec4(0, 0, 0, 0)
    ];
}

//Matrix vector multiplication
function applyMatrix(v, m) {
    var r = vec3(0,0,0);
    r[0] = (m[0][0] * v[0]) + (m[0][1] * v[1]) + (m[0][2] * v[2]);
    r[1] = (m[1][0] * v[0]) + (m[1][1] * v[1]) + (m[1][2] * v[2]);
    r[2] = (m[2][0] * v[0]) + (m[2][1] * v[1]) + (m[2][2] * v[2]);
    return r;
}

//Returns a random number from -1 to 1
function getRandNegToOne(){
    return (Math.random() * 2) - 1;
}

//Converts radian to degrees
function radToDegrees(r) {
    return r*(180 / Math.PI);
}

//From JQuery source code
function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}
  
function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}