var fac_vPosition;
var fac_vNormal;

class GameObject {
    constructor(type_id) {
        this.type_id = type_id;
        this.vBuffer;
        this.iBuffer;
        this.indexCount = 0;
        this.texture;
        this.position = vec3(0, 0, 0);
        this.rotation = vec3(0,0,0);
        this.scale = vec3(1,1,1);
        this.velocity = vec3(0,0,0);
        this.color = vec3(0,0,0);
        this.alive = true;
    }
}

//Mesh information for a square
var squareVertices = [
    -1, 0, -1, 1,       0, 1, 0, 1,
    -1, 0, 1, 1,        0, 1, 0, 1,
     1, 0, 1, 1,        0, 1, 0, 1, 
     1, 0, -1, 1,       0, 1, 0, 1];
var squareIndices = [0,1,2,0,3,2];

//Mesh information for a cube
var cubeVertices =  [
    -1, 1, -1, 1,   -1, 1, -1, 1,
    -1, 1, 1, 1,    -1, 1, 1, 1,
    1, 1, 1, 1,     1, 1, 1, 1,
    1, 1, -1, 1,    1, 1, -1, 1,
    
    -1, -1, -1, 1,  -1, -1, -1, 1,
    -1, -1, 1, 1,   -1, -1, 1, 1,
    1, -1, 1, 1,    1, -1, 1, 1, 
    1, -1, -1, 1,   1, -1, -1, 1];
var cubeIndices = [0,1,2,0,3,2,
                    4,5,6,4,7,6,
                    0,1,4,5,4,1,
                    3,2,6,7,6,3,
                    0,3,4,3,4,7,
                    1,2,5,5,6,2];

//Fire vertices
var fireVertices = [
    -1, 1, 1, 1,    1, 0, 0, 1,
    -1, -1, -1, 1,  1, 0, 0, 1,
    -1, -1, 1, 1,   1, 0, 0, 1,

    -1, -1, -1, 1,  -0.4472, 0, 0.8944, 1,
    -1, 1, -1, 1,   -0.4472, 0, 0.8944, 1,
    1, 0, 0, 1,     -0.4472, 0, 0.8944, 1,

    1, 0, 0, 1,     -0.4472, 0, -0.8944, 1,
    -1, 1, 1, 1,    -0.4472, 0, -0.8944, 1,
    -1, -1, 1, 1,   -0.4472, 0, -0.8944, 1,

    -1, -1, -1, 1,  -0.4472, 0.8944, 0, 1,
    1, 0, 0, 1,     -0.4472, 0.8944, 0, 1,
    -1, -1, 1, 1,   -0.4472, 0.8944, 0, 1,

    1, 0, 0, 1,     -0.4472, -0.8944, 0, 1,
    -1, 1, -1, 1,   -0.4472, -0.8944, 0, 1,
    -1, 1, 1, 1,    -0.4472, -0.8944, 0, 1,

    -1, 1, 1, 1,    1, 0, 0, 1,
    -1, 1, -1, 1,   1, 0, 0, 1,
    -1, -1, -1, 1,  1, 0, 0, 1
];
var fireIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8,
 9, 10, 11, 12, 13, 14, 15, 16, 17];

 //Sphere mesh info
var sphereVertices = [
    0, -1, 0, 1,                        0.1876, -0.7947, 0.5774, 1,
    0.7236, -0.447215, 0.52572, 1,      0.1876, -0.7947, 0.5774, 1,
    -0.276385, -0.447215, 0.85064, 1,   0.1876, -0.7947, 0.5774, 1,

    0.7236, -0.447215, 0.52572, 1,      0.6071, -0.7947, 0.0000, 1,
    0, -1, 0, 1,                        0.6071, -0.7947, 0.0000, 1,
    0.7236, -0.447215, -0.52572, 1,     0.6071, -0.7947, 0.0000, 1,

    0, -1, 0, 1,                        -0.4911, -0.7947, 0.3568, 1,
    -0.276385, -0.447215, 0.85064, 1,   -0.4911, -0.7947, 0.3568, 1,
    -0.894425, -0.447215, 0, 1,         -0.4911, -0.7947, 0.3568, 1,

    0, -1, 0, 1,                        -0.4911, -0.7947, -0.3568, 1,
    -0.894425, -0.447215, 0, 1,         -0.4911, -0.7947, -0.3568, 1,
    -0.276385, -0.447215, -0.85064, 1,  -0.4911, -0.7947, -0.3568, 1,

    0, -1, 0, 1,                        0.1876, -0.7947, -0.5774, 1,
    -0.276385, -0.447215, -0.85064, 1,  0.1876, -0.7947, -0.5774, 1,
    0.7236, -0.447215, -0.52572, 1,     0.1876, -0.7947, -0.5774, 1,

    0.7236, -0.447215, 0.52572, 1,      0.9822, -0.1876, 0.0000, 1,
    0.7236, -0.447215, -0.52572, 1,     0.9822, -0.1876, 0.0000, 1,
    0.894425, 0.447215, 0, 1,           0.9822, -0.1876, 0.0000, 1,

    -0.276385, -0.447215, 0.85064, 1,   0.3035, -0.1876, 0.9342, 1, 
    0.7236, -0.447215, 0.52572, 1,      0.3035, -0.1876, 0.9342, 1, 
    0.276385, 0.447215, 0.85064, 1,     0.3035, -0.1876, 0.9342, 1,

    -0.894425, -0.447215, 0, 1,         -0.7946, -0.1876, 0.5774, 1,
    -0.276385, -0.447215, 0.85064, 1,   -0.7946, -0.1876, 0.5774, 1, 
    -0.7236, 0.447215, 0.52572, 1,      -0.7946, -0.1876, 0.5774, 1,

    -0.276385, -0.447215, -0.85064, 1,  -0.7946, -0.1876, -0.5774, 1,
    -0.894425, -0.447215, 0, 1,         -0.7946, -0.1876, -0.5774, 1,
    -0.7236, 0.447215, -0.52572, 1,     -0.7946, -0.1876, -0.5774, 1,

    0.7236, -0.447215, -0.52572, 1,     0.3035, -0.1876, -0.9342, 1,
    -0.276385, -0.447215, -0.85064, 1,  0.3035, -0.1876, -0.9342, 1,
    0.276385, 0.447215, -0.85064, 1,    0.3035, -0.1876, -0.9342, 1,

    0.7236, -0.447215, 0.52572, 1,      0.7946, 0.1876, 0.5774, 1,
    0.894425, 0.447215, 0, 1,           0.7946, 0.1876, 0.5774, 1,
    0.276385, 0.447215, 0.85064, 1,     0.7946, 0.1876, 0.5774, 1,

    -0.276385, -0.447215, 0.85064, 1,   -0.3035, 0.1876, 0.9342, 1,
    0.276385, 0.447215, 0.85064, 1,     -0.3035, 0.1876, 0.9342, 1,
    -0.7236, 0.447215, 0.52572, 1,      -0.3035, 0.1876, 0.9342, 1,

    -0.894425, -0.447215, 0, 1,         -0.9822, 0.1876, 0.0000, 1,
    -0.7236, 0.447215, 0.52572, 1,      -0.9822, 0.1876, 0.0000, 1,
    -0.7236, 0.447215, -0.52572, 1,     -0.9822, 0.1876, 0.0000, 1,

    -0.276385, -0.447215, -0.85064, 1,  -0.3035, 0.1876, -0.9342, 1,
    -0.7236, 0.447215, -0.52572, 1,     -0.3035, 0.1876, -0.9342, 1,
    0.276385, 0.447215, -0.85064, 1,    -0.3035, 0.1876, -0.9342, 1,

    0.7236, -0.447215, -0.52572, 1,     0.7946, 0.1876, -0.5774, 1,
    0.276385, 0.447215, -0.85064, 1,    0.7946, 0.1876, -0.5774, 1,
    0.894425, 0.447215, 0, 1,           0.7946, 0.1876, -0.5774, 1,

    0.276385, 0.447215, 0.85064, 1,     0.4911, 0.7947, 0.3568, 1,
    0.894425, 0.447215, 0, 1,           0.4911, 0.7947, 0.3568, 1,
    0, 1, 0, 1,                         0.4911, 0.7947, 0.3568, 1,

    -0.7236, 0.447215, 0.52572, 1,      -0.1876, 0.7947, 0.5774, 1,
    0.276385, 0.447215, 0.85064, 1,     -0.1876, 0.7947, 0.5774, 1,
    0, 1, 0, 1,                         -0.1876, 0.7947, 0.5774, 1,

    -0.7236, 0.447215, -0.52572, 1,     -0.6071, 0.7947, 0.0000, 1,
    -0.7236, 0.447215, 0.52572, 1,      -0.6071, 0.7947, 0.0000, 1,
    0, 1, 0, 1,                         -0.6071, 0.7947, 0.0000, 1,

    0.276385, 0.447215, -0.85064, 1,    -0.1876, 0.7947, -0.5774, 1,
    -0.7236, 0.447215, -0.52572, 1,     -0.1876, 0.7947, -0.5774, 1,
    0, 1, 0, 1,                         -0.1876, 0.7947, -0.5774, 1,

    0.894425, 0.447215, 0, 1,           0.4911, 0.7947, -0.3568, 1,
    0.276385, 0.447215, -0.85064, 1,    0.4911, 0.7947, -0.3568, 1,
    0, 1, 0, 1,                         0.4911, 0.7947, -0.3568, 1,
];
var sphereIndices = [
    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
    30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,
    57,58,59
];

//Shrapnel vertices
var shrapnelVertices = [
    -1, 1, 1, 1,    -1, 0, 0, 1,
    -1, -1, -1, 1,  -1, 0, 0, 1,
    -1, -1, 1, 1,   -1, 0, 0, 1,

    -1, -1, -1, 1,  0.4472, 0, -0.8944, 1,
    -1, 1, -1, 1,   0.4472, 0, -0.8944, 1,
    1, 0, 0, 1,     0.4472, 0, -0.8944, 1,

    1, 0, 0, 1,     0.4472, 0, 0.8944, 1,
    -1, 1, 1, 1,    0.4472, 0, 0.8944, 1,
    -1, -1, 1, 1,   0.4472, 0, 0.8944, 1,

    -1, -1, -1, 1,  0.4472, -0.8944, 0, 1,
    1, 0, 0, 1,     0.4472, -0.8944, 0, 1,
    -1, -1, 1, 1,   0.4472, -0.8944, 0, 1,

    1, 0, 0, 1,     0.4472, 0.8944, 0, 1,
    -1, 1, -1, 1,   0.4472, 0.8944, 0, 1,
    -1, 1, 1, 1,    0.4472, 0.8944, 0, 1,

    -1, 1, 1, 1,    -1, 0, 0, 1,
    -1, 1, -1, 1,   -1, 0, 0, 1,
    -1, -1, -1, 1,  -1, 0, 0, 1
];
var shrapnelIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8,
 9, 10, 11, 12, 13, 14, 15, 16, 17];

//Projectile mesh
var projVertices = [
    0, -1, 0, 1,                        -0.1876, 0.7947, -0.5774, 1,
    0.7236, -0.447215, 0.52572, 1,      -0.1876, 0.7947, -0.5774, 1,
    -0.276385, -0.447215, 0.85064, 1,   -0.1876, 0.7947, -0.5774, 1,

    0.7236, -0.447215, 0.52572, 1,      -0.6071, 0.7947, 0.0000, 1,
    0, -1, 0, 1,                        -0.6071, 0.7947, 0.0000, 1,
    0.7236, -0.447215, -0.52572, 1,     -0.6071, 0.7947, 0.0000, 1,

    0, -1, 0, 1,                        0.4911, 0.7947, -0.3568, 1,
    -0.276385, -0.447215, 0.85064, 1,   0.4911, 0.7947, -0.3568, 1,
    -0.894425, -0.447215, 0, 1,         0.4911, 0.7947, -0.3568, 1,

    0, -1, 0, 1,                        0.4911, 0.7947, 0.3568, 1,
    -0.894425, -0.447215, 0, 1,         0.4911, 0.7947, 0.3568, 1,
    -0.276385, -0.447215, -0.85064, 1,  0.4911, 0.7947, 0.3568, 1,

    0, -1, 0, 1,                        -0.1876, 0.7947, 0.5774, 1,
    -0.276385, -0.447215, -0.85064, 1,  -0.1876, 0.7947, 0.5774, 1,
    0.7236, -0.447215, -0.52572, 1,     -0.1876, 0.7947, 0.5774, 1,

    0.7236, -0.447215, 0.52572, 1,      -0.9822, 0.1876, 0.0000, 1,
    0.7236, -0.447215, -0.52572, 1,     -0.9822, 0.1876, 0.0000, 1,
    0.894425, 0.447215, 0, 1,           -0.9822, 0.1876, 0.0000, 1,

    -0.276385, -0.447215, 0.85064, 1,   -0.3035, 0.1876, -0.9342, 1, 
    0.7236, -0.447215, 0.52572, 1,      -0.3035, 0.1876, -0.9342, 1, 
    0.276385, 0.447215, 0.85064, 1,     -0.3035, 0.1876, -0.9342, 1,

    -0.894425, -0.447215, 0, 1,         0.7946, 0.1876, -0.5774, 1,
    -0.276385, -0.447215, 0.85064, 1,   0.7946, 0.1876, -0.5774, 1, 
    -0.7236, 0.447215, 0.52572, 1,      0.7946, 0.1876, -0.5774, 1,

    -0.276385, -0.447215, -0.85064, 1,  0.7946, 0.1876, 0.5774, 1,
    -0.894425, -0.447215, 0, 1,         0.7946, 0.1876, 0.5774, 1,
    -0.7236, 0.447215, -0.52572, 1,     0.7946, 0.1876, 0.5774, 1,

    0.7236, -0.447215, -0.52572, 1,     -0.3035, 0.1876, 0.9342, 1,
    -0.276385, -0.447215, -0.85064, 1,  -0.3035, 0.1876, 0.9342, 1,
    0.276385, 0.447215, -0.85064, 1,    -0.3035, 0.1876, 0.9342, 1,

    0.7236, -0.447215, 0.52572, 1,      -0.7946, -0.1876, -0.5774, 1,
    0.894425, 0.447215, 0, 1,           -0.7946, -0.1876, -0.5774, 1,
    0.276385, 0.447215, 0.85064, 1,     -0.7946, -0.1876, -0.5774, 1,

    -0.276385, -0.447215, 0.85064, 1,   0.3035, -0.1876, -0.9342, 1,
    0.276385, 0.447215, 0.85064, 1,     0.3035, -0.1876, -0.9342, 1,
    -0.7236, 0.447215, 0.52572, 1,      0.3035, -0.1876, -0.9342, 1,

    -0.894425, -0.447215, 0, 1,         0.9822, -0.1876, 0.0000, 1,
    -0.7236, 0.447215, 0.52572, 1,      0.9822, -0.1876, 0.0000, 1,
    -0.7236, 0.447215, -0.52572, 1,     0.9822, -0.1876, 0.0000, 1,

    -0.276385, -0.447215, -0.85064, 1,  0.3035, -0.1876, 0.9342, 1,
    -0.7236, 0.447215, -0.52572, 1,     0.3035, -0.1876, 0.9342, 1,
    0.276385, 0.447215, -0.85064, 1,    0.3035, -0.1876, 0.9342, 1,

    0.7236, -0.447215, -0.52572, 1,     -0.7946, -0.1876, 0.5774, 1,
    0.276385, 0.447215, -0.85064, 1,    -0.7946, -0.1876, 0.5774, 1,
    0.894425, 0.447215, 0, 1,           -0.7946, -0.1876, 0.5774, 1,

    0.276385, 0.447215, 0.85064, 1,     -0.4911, -0.7947, -0.3568, 1,
    0.894425, 0.447215, 0, 1,           -0.4911, -0.7947, -0.3568, 1,
    0, 1, 0, 1,                         -0.4911, -0.7947, -0.3568, 1,

    -0.7236, 0.447215, 0.52572, 1,      0.1876, -0.7947, -0.5774, 1,
    0.276385, 0.447215, 0.85064, 1,     0.1876, -0.7947, -0.5774, 1,
    0, 1, 0, 1,                         0.1876, -0.7947, -0.5774, 1,

    -0.7236, 0.447215, -0.52572, 1,     0.6071, -0.7947, 0.0000, 1,
    -0.7236, 0.447215, 0.52572, 1,      0.6071, -0.7947, 0.0000, 1,
    0, 1, 0, 1,                         0.6071, -0.7947, 0.0000, 1,

    0.276385, 0.447215, -0.85064, 1,    0.1876, -0.7947, 0.5774, 1,
    -0.7236, 0.447215, -0.52572, 1,     0.1876, -0.7947, 0.5774, 1,
    0, 1, 0, 1,                         0.1876, -0.7947, 0.5774, 1,

    0.894425, 0.447215, 0, 1,           -0.4911, -0.7947, 0.3568, 1,
    0.276385, 0.447215, -0.85064, 1,    -0.4911, -0.7947, 0.3568, 1,
    0, 1, 0, 1,                         -0.4911, -0.7947, 0.3568, 1,
];
var projIndices = [
    0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
    30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,
    57,58,59
];

function buildSquare(id){
    var square = new GameObject(id);
    square.type_id = id;
    square.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, square.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(squareVertices), gl.STATIC_DRAW);

    square.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareIndices), gl.STATIC_DRAW);

    square.indexCount = squareIndices.length;

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 32, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vNormal, 4, gl.FLOAT, false, 32, 16 );
    gl.enableVertexAttribArray( fac_vNormal );

    return square;
}

function buildCube(id){
    var cube = new GameObject(id);
    cube.type_id = id;
    cube.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cube.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeVertices), gl.STATIC_DRAW);

    cube.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    cube.indexCount = cubeIndices.length;

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 32, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vNormal, 4, gl.FLOAT, false, 32, 16 );
    gl.enableVertexAttribArray( fac_vNormal );

    return cube;
}

function buildFire(id){
    var proj = new GameObject(id);
    proj.type_id = id;
    proj.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, proj.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(fireVertices), gl.STATIC_DRAW);

    proj.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, proj.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(fireIndices), gl.STATIC_DRAW);

    proj.indexCount = fireIndices.length;

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 32, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vNormal, 4, gl.FLOAT, false, 32, 16 );
    gl.enableVertexAttribArray( fac_vNormal );

    return proj;
}

function buildProjectile(id){
    var proj = new GameObject(id);
    proj.type_id = id;
    proj.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, proj.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(projVertices), gl.STATIC_DRAW);

    proj.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, proj.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(projIndices), gl.STATIC_DRAW);

    proj.indexCount = projIndices.length;

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 32, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vNormal, 4, gl.FLOAT, false, 32, 16 );
    gl.enableVertexAttribArray( fac_vNormal );

    return proj;
}

function buildSphere(id){
    var sphere = new GameObject(id);
    sphere.type_id = id;
    sphere.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphere.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereVertices), gl.STATIC_DRAW);

    sphere.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphere.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);

    sphere.indexCount = sphereIndices.length;

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 32, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vNormal, 4, gl.FLOAT, false, 32, 16 );
    gl.enableVertexAttribArray( fac_vNormal );

    return sphere;
}

function buildShrapnel(id){
    var shrapnel = new GameObject(id);
    shrapnel.type_id = id;
    shrapnel.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, shrapnel.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(shrapnelVertices), gl.STATIC_DRAW);

    shrapnel.iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shrapnel.iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shrapnelIndices), gl.STATIC_DRAW);

    shrapnel.indexCount = shrapnelIndices.length;

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 32, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vNormal, 4, gl.FLOAT, false, 32, 16 );
    gl.enableVertexAttribArray( fac_vNormal );

    return shrapnel;
}