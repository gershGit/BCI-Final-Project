/*
    WebGL Program using an FPS camera with speed of time controlled by alpha waves from OpenBCI
*/

//Global variables to hold webGL objects
var canvas;
var gl;

//Variables for the shaders
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
var viewMat = lookAt(vec3(0,0,1.5), vec3(0,0,0), vec3(0,1,0));
var perspMat = perspective(120, 1, 0.1, 16.0);

//Time Control
var lastTime;
var deltaTime;
var paused = false;
var timeSpeed = 1.0; 

//Global data
var objectList = [];

window.onload = function init() {
    canvas = document.getElementById("gl-canvas"); //Get canvas from html
    gl = WebGLUtils.setupWebGL(canvas);	//Get gl context from Common directory
    if ( !gl ) { alert( "WebGL failed to load" ); }	//Error handle when WebGL fails

    gl.viewport(0, 0, canvas.width, canvas.height);	//Set the viewport equal to the canvas
    gl.clearColor(0.1, 0.2, 0.3, 1.0);	//Set the clear color to white
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

    console.log("Hello world!");
    objectList.push(buildSquare(0));
    mainLoop();
}

function mainLoop(){
    lastTime = Date.now();
    //TODO gather BCI data                                  <Make separate javascript file for this>
    //TODO apply BCI to difficulty
    //TODO calculate input
    //TODO calculate physics
    //TODO calculate collisions / points / delete objects   <Points in HTML / CSS? >
    render();
    //TODO render UI if not in html
    requestAnimationFrame(mainLoop);
}

function render(){
    //Clear the canvas
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.uniformMatrix4fv(view, gl.TRUE, flatten(viewMat));
    gl.uniformMatrix4fv(perspective_id, gl.TRUE, flatten(perspMat));
    //Render each object in the master list
    for (i=0; i<objectList.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, objectList[i].vBuffer); 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objectList[i].iBuffer);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 24, 16 );
        gl.uniform1i(tPosition, objectList[i].texture);
        gl.uniformMatrix4fv(model_id, gl.TRUE, flatten( getTransform(objectList[i].position, objectList[i].rotation, objectList[i].scale) ));
        gl.drawElements(gl.TRIANGLES, objectList[i].indexCount, gl.UNSIGNED_SHORT, 0);
    }
}

function getTransform(t, r, s) {
    var mat = scalem(s[0], s[1], s[2]);
    mat = mult (rotate(r[0], vec3(1,0,0)) , mat);
    mat = mult (rotate(r[1], vec3(0,1,0)) , mat);
    mat = mult (rotate(r[2], vec3(0,0,1)) , mat);
    mat = mult (translate(t[0], t[1], t[2]) , mat);
    return mat;
}