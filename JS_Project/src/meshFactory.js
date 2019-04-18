var fac_vPosition;
var fac_vTexCoord;

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
    }
}

//Mesh information for a square
var squareVertices = [-1, 0, -1, 1, 0,0,
    -1, 0, 1, 1, 0,1,
     1, 0, 1, 1, 1,1, 
     1, 0, -1, 1, 1,0];
var squareIndices = [0,1,2,0,3,2];

//Mesh information for a cube
var cubeVertices =  [
    -1, 1, -1, 1, 0,0,
    -1, 1, 1, 1, 0,1,
    1, 1, 1, 1, 1,1, 
    1, 1, -1, 1, 1,0, 
    
    -1, -1, -1, 1, 0,0,
    -1, -1, 1, 1, 0,1,
    1, -1, 1, 1, 1,1, 
    1, -1, -1, 1, 1,0];
var cubeIndices = [0,1,2,0,3,2,
                    4,5,6,4,7,6,
                    0,1,4,5,4,1,
                    3,2,6,7,6,3,
                    0,3,4,3,4,7,
                    1,2,5,5,6,2];

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

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 24, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vTexCoord, 2, gl.FLOAT, false, 24, 16 );
    gl.enableVertexAttribArray( fac_vTexCoord );

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

    gl.vertexAttribPointer( fac_vPosition, 4, gl.FLOAT, false, 24, 0 );
    gl.enableVertexAttribArray( fac_vPosition );
    gl.vertexAttribPointer( fac_vTexCoord, 2, gl.FLOAT, false, 24, 16 );
    gl.enableVertexAttribArray( fac_vTexCoord );

    return cube;
}