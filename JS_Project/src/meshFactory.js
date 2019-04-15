var fac_vPosition;
var fac_vTexCoord;

class GameObject {
    constructor(id) {
        this.id = id;
        this.vBuffer;
        this.iBuffer;
        this.indexCount = 0;
        this.texture;
        this.position = translate(0, 0, 0);
        this.rotation = translate(0,0,0);
        this.scale = scalem(1,1,1);
    }
}

//Mesh information for a square
var squareVertices = [-1, 0, -1, 1, 0,0,
    -1, 0, 1, 1, 0,1,
     1, 0, 1, 1, 1,1, 
     1, 0, -1, 1, 1,0];
var squareIndices = [0,1,2,0,3,2];

function buildSquare(id){
    var square = new GameObject(id);
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