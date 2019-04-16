/*
    WebGL Program using an FPS camera with speed of time controlled by alpha waves from OpenBCI
*/

//Global variables to hold webGL objects
var canvas;
var gl;
var locked = false;

//Uniform IDs
var model_id;
var view;
var perspective_id;
var texture_id;
var lightPos_id;
//Attribute locations
var vPosition;
var vTexCoord;
//Shader Program
var vProgram;
//View and perspective matrices
var sensitivity = 0.3;
var camPos = vec3(0.0,0.2,0);
var camDir = vec3(0.0,0.0,-1.0);
var perspMat = perspective(70, 1, 0.1, 48.0);

//Time Control
var lastTime;
var deltaTime;
var scaledTime;
var paused = false;
var timeSpeed = 1.0; 
var timeSinceLastLaunch = 0.0; //Tracking variable for fire rate

//Global data
var objectList = [];

//Setup on load
window.onload = function init() {
    canvas = document.getElementById("gl-canvas"); //Get canvas from html

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
                var newProjectile = buildCube(1);
                newProjectile.scale = vec3(0.2, 0.2, 0.2);
                newProjectile.position = add(vec3(0,0.2,0), scale(2,camDir));
                newProjectile.velocity = scale(15.0, camDir);
                objectList.push(newProjectile);
                timeSinceLastLaunch = 0.0;
            }

        }
        canvas.requestPointerLock();
    };

    gl = WebGLUtils.setupWebGL(canvas);	//Get gl context from Common directory
    if ( !gl ) { alert( "WebGL failed to load" ); }	//Error handle when WebGL fails

    gl.viewport(0, 0, canvas.width, canvas.height);	//Set the viewport equal to the canvas
    gl.clearColor(0.7, 1.0, 1.0, 1.0);	//Set the clear color to white
    gl.enable(gl.DEPTH_TEST); //Turns on depth testing

    vProgram = initShaders(gl, "vertex-shader", "fragment-shader");	//Compile the shader program
    gl.useProgram(vProgram);	//Activate the shader program

    //Get uniform variable locations in the shader program
    model_id = gl.getUniformLocation( vProgram, "modelMat" );
    view = gl.getUniformLocation(vProgram, "view");
    perspective_id = gl.getUniformLocation(vProgram, "perspective");
    lightPos_id = gl.getUniformLocation( vProgram, "lightPos");
    tPosition = gl.getUniformLocation(vProgram, 'textureSampler');
    vPosition = gl.getAttribLocation(vProgram, "vPosition");
    vTexCoord = gl.getAttribLocation( vProgram, "vTexCoord" ); 

    fac_vPosition = vPosition;
    fac_vTexCoord = vTexCoord;

    objectList.push(buildSquare(0));
    objectList[0].position = subtract(objectList[0].position, vec3(0.0,0.25,0.0));
    objectList[0].scale = vec3(3,3,3);

    lastTime = Date.now();
    mainLoop();
}

//Runs continuously and handles per frame function calls
function mainLoop(){
    //Handle time calculations
    deltaTime = (Date.now() - lastTime) / 1000.0;
    lastTime = Date.now();
    scaledTime = deltaTime * timeSpeed;
    timeSinceLastLaunch += deltaTime;

    //TODO gather BCI data                                  <Make separate javascript file for this>
    //TODO apply BCI to difficulty
    updatePhysics();
    calculateCollisions();
    //TODO                                                  <Points in HTML / CSS? >
    render();
    //TODO render UI if not in html
    requestAnimationFrame(mainLoop);
}

//Updates the position of all objects using physics
function updatePhysics(){
    for (i=0; i<objectList.length; i++) {
        //1 for projectiles
        if (objectList[i].type_id == 1) {
            //Calculate the change in position
            var deltaPos = scale(deltaTime, add( objectList[i].velocity , scale(deltaTime*0.5, vec3(0,-9.8,0))) );
            //console.log(deltaPos[0], deltaPos[1], deltaPos[2]);
            objectList[i].position = add(objectList[i].position, deltaPos);
            objectList[i].velocity = add(objectList[i].velocity, scale(deltaTime, vec3(0,-9.8,0)));
        }
        //2 for enemies
        else if (objectList[i].type_id == 2){

        }
    }
}

//TODO calculate collisions / points / delete objects
function calculateCollisions(){
    for (i=0; i<objectList.length; i++) {
        //1 for projectiles
        if (objectList[i].type_id == 1) {
            //Calculate the change in position
            if (objectList[i].position[1] < -5) {
                objectList.splice(i,1); //Remove projectiles that have fallen out of screen
            }
        }
        //2 for enemies
        else if (objectList[i].type_id == 2){

        }
    }
}

//Renders all objects in scene
function render(){
    //Clear the canvas
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.uniformMatrix4fv(view, gl.TRUE, flatten(lookAt(camPos, add(camPos, camDir), vec3(0,1,0))));
    gl.uniformMatrix4fv(perspective_id, gl.TRUE, flatten(perspMat));
    //Render each object in the master list
    for (i=0; i<objectList.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, objectList[i].vBuffer); 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectList[i].iBuffer);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 24, 16 );

        //TODO send in color data
        gl.uniform1i(tPosition, objectList[i].texture);
        gl.uniformMatrix4fv(model_id, gl.TRUE, flatten( getTransform(objectList[i].position, objectList[i].rotation, objectList[i].scale) ));
        gl.drawElements(gl.TRIANGLES, objectList[i].indexCount, gl.UNSIGNED_SHORT, 0);
    }
}

//Returns a transformation matrix from a position, rotation, and scale
function getTransform(t, r, s) {
    var mat = scalem(s[0], s[1], s[2]);
    mat = mult (rotate(r[0], vec3(1,0,0)) , mat);
    mat = mult (rotate(r[1], vec3(0,1,0)) , mat);
    mat = mult (rotate(r[2], vec3(0,0,1)) , mat);
    mat = mult (translate(t[0], t[1], t[2]) , mat);
    return mat;
}

//From Mozilla documentation: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) {
      locked = true;
      document.addEventListener("mousemove", updatePosition, false);
    } else {
      locked = false;
      document.removeEventListener("mousemove", updatePosition, false);
    }
  }

//Updates the camera rotation based on the mouse movement
function updatePosition(e) {
    //TODO mouse movement gets inverted Y after turning around
    var xRot = rotate(-e.movementX, vec3(0,1,0));
    var yRot = rotate(-e.movementY, vec3(1,0,0));
    camDir = applyMatrix(camDir, mult(xRot, yRot));
}

//Matrix vector multiplication
function applyMatrix(v, m) {
    var r = vec3(0,0,0);
    r[0] = (m[0][0] * v[0]) + (m[0][1] * v[1]) + (m[0][2] * v[2]);
    r[1] = (m[1][0] * v[0]) + (m[1][1] * v[1]) + (m[1][2] * v[2]);
    r[2] = (m[2][0] * v[0]) + (m[2][1] * v[1]) + (m[2][2] * v[2]);
    return r;
}