"use strict";

let canvas;
let gl;
let program;
let skyboxProgram;

let projectionMatrix, projectionMatrixLoc;
let modelViewMatrix, modelViewMatrixLoc;
let modelViewShadowMatrix, modelViewShadowMatrixLoc;
let cameraMatrix, cameraMatrixLoc;

let aspect;
let near = 0.1;
let far = 100;

//eye = vec3(0, 0, 20);                      //z value, looking down at z axis
let eye = vec3(-6.0, 3.0, 0.0);     //where the camera is in the world, pos of eye in 3d space
let at = vec3(0.0, 0.0, 0.0);       //where the camera is looking at
let up = vec3(0.0, 1.0, 0.0);       //the direction of the up vector, unit vector pointing upwards

//multiple form objects
let scene_obj;
let obj_array = [];
let car_mtl;
let car_obj;
let lamp_mtl;
let lamp_obj;
let stopsign_mtl;
let stopsign_obj;
let street_mtl;
let street_obj;
let street_alt_mtl;
let street_alt_obj;
let bunny_obj;
let bunny_mtl;
let camera_obj;

let start = Date.now();
let rotationVariant = 1;    //rotations per rotations, how many times you want the car to rotate every time car orbits track
let shadowMatrix;


//multiple form objects URLs
let bunny_obj_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/bunny.obj";
let bunny_mtl_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/bunny.mtl";
let car_mtl_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/car.mtl";
let car_obj_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/car.obj";
let lamp_mtl_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/lamp.mtl";
let lamp_obj_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/lamp.obj";
let stop_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/stop.png";
let stop_alt_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/stop_alt.png";
let stopsign_mtl_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/stopsign.mtl";
let stopsign_obj_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/stopsign.obj";
let street_mtl_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/street.mtl";
let street_obj_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/street.obj";
let street_alt_mtl_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/street_alt.mtl";
let street_alt_obj_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/street_alt.obj";


//cube map
var red = new Uint8Array([255, 0, 0, 255]);
var green = new Uint8Array([0, 255, 0, 255]);
var blue = new Uint8Array([0, 0, 255, 255]);
var cyan = new Uint8Array([0, 255, 255, 255]);
var magenta = new Uint8Array([255, 0, 255, 255]);
var yellow = new Uint8Array([255, 255, 0, 255]);
let skybox_negx_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/skybox_negx.png";
let skybox_negy_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/skybox_negy.png";
let skybox_negz_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/skybox_negz.png";
let skybox_posx_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/skybox_posx.png";
let skybox_posy_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/skybox_posy.png";
let skybox_posz_png_URL = "https://web.cs.wpi.edu/~jmcuneo/cs4731/project3_1/skybox_posz.png";
// Fill the buffer with the values that define a cube.



let skyboxPositions = new Float32Array(
    [
        -0.5, -0.5,  -0.5,
        -0.5,  0.5,  -0.5,
        0.5, -0.5,  -0.5,
        -0.5,  0.5,  -0.5,
        0.5,  0.5,  -0.5,
        0.5, -0.5,  -0.5,

        -0.5, -0.5,   0.5,
        0.5, -0.5,   0.5,
        -0.5,  0.5,   0.5,
        -0.5,  0.5,   0.5,
        0.5, -0.5,   0.5,
        0.5,  0.5,   0.5,

        -0.5,   0.5, -0.5,
        -0.5,   0.5,  0.5,
        0.5,   0.5, -0.5,
        -0.5,   0.5,  0.5,
        0.5,   0.5,  0.5,
        0.5,   0.5, -0.5,

        -0.5,  -0.5, -0.5,
        0.5,  -0.5, -0.5,
        -0.5,  -0.5,  0.5,
        -0.5,  -0.5,  0.5,
        0.5,  -0.5, -0.5,
        0.5,  -0.5,  0.5,

        -0.5,  -0.5, -0.5,
        -0.5,  -0.5,  0.5,
        -0.5,   0.5, -0.5,
        -0.5,  -0.5,  0.5,
        -0.5,   0.5,  0.5,
        -0.5,   0.5, -0.5,

        0.5,  -0.5, -0.5,
        0.5,   0.5, -0.5,
        0.5,  -0.5,  0.5,
        0.5,  -0.5,  0.5,
        0.5,   0.5, -0.5,
        0.5,   0.5,  0.5,

    ]);



/**
 * Lighting Data
 */
//let lightPosition = vec4(1.0, 2.0, 2.0, 1.0 );
let lightPosition = vec3(0.0, 4.0, 0.0);   // prof ex. vec3(1.5, 0.0, 2.0);
let m;  //matrix "m" projects a vertex V to give its projection V in shadow polygon

let cubeMap;

let lightingOn = true;
let parentCameraToCar = false;
let shadowsOn = false;
let carAnimate = false;
let reflectionOn = false;
let refractionOn = false;

var dAngle = 0.0;
var rotationRate = 1/5;     //the speed of the rotation --> 1/x,
                            //numerator is always 1, because in real time, want to go in 1 second
                            // x is how slow you want it to be
                            // x seconds real seconds go into 1 second of simulation time

let deltaT = 0.0;           //distance = time, time / time, distance between seconds


//event handler for user input
window.onkeypress = function(event) {

    var key = event.key;
    switch(key) {
        //Toggle sphere's modeChanger mode (un-lit) when key 'm' is hit
        //post on piazza on switching between modeChanger and Phong shading
        case 'l':                 //initial case, wireMesh == true -> if 'm' called
            console.log("lighting");
            lightingOn = !lightingOn;
            break;
        case 'c':
            console.log("camera, car");
            parentCameraToCar = !parentCameraToCar;
            break;
        case 'm':
            console.log("move car down road");
            carAnimate = !carAnimate;
            break;
        case 's':
            console.log("shadow");
            shadowsOn = !shadowsOn;
            break;
        case 'e':
            console.log("skybox");
            break;
        case 'r':
            console.log("car reflection");
            reflectionOn = !reflectionOn;
            break;
        case 'f':
            console.log("ornament refraction");
            refractionOn = !refractionOn;
            break;
    }
}

/**
 * Main function that runs the program
 */
window.onload = async function init() {            //this data is important, don't try to load async, need to know this data before moving on
    //marking that function, changing from a function that can be deferred to not be
    //this thing will be an async function
    //if not, it would try to load the data before getting it, so it would always be black
    //wait till it's loaded and processed and then process it

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    canvas.style.border = "0.1px solid black";
    aspect = canvas.width/canvas.height;

    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    skyboxProgram = initShaders( gl, "vertex-shader-skybox", "fragment-shader-skybox");
    gl.useProgram(program);

    //configure cube map, called once to configure before the rest of the program.
    //should be called after cube map images are loaded

    let skybox_negx = new Image();
    skybox_negx.crossOrigin = "";
    skybox_negx.src = skybox_negx_png_URL;
    skybox_negx.onload = function() {

        let skybox_negy = new Image();
        skybox_negy.crossOrigin = "";
        skybox_negy.src = skybox_negy_png_URL;
        skybox_negy.onload = function() {

            let skybox_negz = new Image();
            skybox_negz.crossOrigin = "";
            skybox_negz.src = skybox_negz_png_URL;
            skybox_negz.onload = function() {

                let skybox_posx = new Image();
                skybox_posx.crossOrigin = "";
                skybox_posx.src = skybox_posx_png_URL;
                skybox_posx.onload = function() {

                    let skybox_posy = new Image();
                    skybox_posy.crossOrigin = "";
                    skybox_posy.src = skybox_posy_png_URL;
                    skybox_posy.onload = function() {

                        let skybox_posz = new Image();
                        skybox_posz.crossOrigin = "";
                        skybox_posz.src = skybox_posz_png_URL;
                        skybox_posz.onload = function() {
                            configureCubeMapImage(skybox_negx, skybox_negy, skybox_negz, skybox_posx, skybox_posy, skybox_posz);
                        }

                    }
                }
            }
        }
    }

    configureCubeMap();


    //will be cube map configure per object --> bunny & car --> uniform
    //property for is reflective --> floating point number, bunny is more reflective than car

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    console.log("now starting object parsing!")
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*******************
     *
     * parse mtls
     *
     * ****************/

     ///////////////////////////////////////////////////
    //1) car mtl

    let car_mtl_text = await fetchText(car_mtl_URL);
    car_mtl = new sceneObjectMTL();
    parseMTLs(car_mtl_text, car_mtl);
    car_mtl.mtlName = "car_mtl";
    //console.log("car_mtl:", car_mtl);

    ///////////////////////////////////////////////////
    //2) lamp mtl

    let lamp_mtl_text = await fetchText(lamp_mtl_URL);
    lamp_mtl = new sceneObjectMTL();
    parseMTLs(lamp_mtl_text, lamp_mtl);
    lamp_mtl.mtlName = "lamp_mtl";
    //console.log("lamp_mtl:", lamp_mtl);

    ///////////////////////////////////////////////////
    //3)stop sign mtl

    let stopsign_mtl_text = await fetchText(stopsign_mtl_URL);
    stopsign_mtl = new sceneObjectMTL();
    parseMTLs(stopsign_mtl_text, stopsign_mtl);
    stopsign_mtl.mtlName = "stopsign_mtl";
    //stopsign_mtl.createAndConfigureATexture(stop_png_URL, gl);        //configure texture
    stopsign_mtl.createAndConfigureATexture(stop_alt_png_URL, gl);      //configure texture
    //console.log("stopsign_mtl:", stopsign_mtl);

    ///////////////////////////////////////////////////
    //4)street mtl

    let street_mtl_text = await fetchText(street_mtl_URL);
    street_mtl = new sceneObjectMTL();
    parseMTLs(street_mtl_text, street_mtl);
    street_mtl.mtlName = "street_mtl";
    //console.log("street_mtl:", street_mtl);

    ///////////////////////////////////////////////////
    //5)street alt

    let street_alt_mtl_text = await fetchText(street_alt_mtl_URL);
    street_alt_mtl = new sceneObjectMTL();
    parseMTLs(street_alt_mtl_text, street_alt_mtl);
    street_alt_mtl.mtlName = "street_alt_mtl";
    //console.log("street_alt_mtl:", street_alt_mtl);

    ///////////////////////////////////////////////////
    //6) bunny mtl

    let bunny_mtl_text = await fetchText(bunny_mtl_URL);
    bunny_mtl = new sceneObjectMTL();
    parseMTLs(bunny_mtl_text, bunny_mtl);
    bunny_mtl.mtlName = "bunny_mtl";
    //console.log("bunny_mtl:", bunny_mtl);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*******************
     *
     * parse objects
     *
     * ****************/

    ///////////////////////////////////////////////////
    //1) car

    let car_text = await fetchText(car_obj_URL);
    car_obj = new sceneObject();
    parseObjects(car_text, car_obj, car_mtl);
    car_obj.objectName = "car_obj";
    car_obj.translateObjectPoints(0,0, 3);            //set the car object position
    car_obj.rotateObjectPoints(0, 1, 0, 90);     //set the car object rotation
    car_obj.scaleObjectPoints(1, 1, 1);              //set the car object scale
    car_obj.shadowOn = true;
    car_obj.reflectionOn = 0.5;
    console.log("car_obj:", car_obj);

    ///////////////////////////////////////////////////
    //2) lamp

    let lamp_text = await fetchText(lamp_obj_URL);
    lamp_obj = new sceneObject();
    parseObjects(lamp_text, lamp_obj, lamp_mtl);
    lamp_obj.objectName = "lamp_obj";
    console.log("lamp_obj:", lamp_obj);

    ////////////////////////////////////////////////////
    //3) stop sign
    let stopsign_text = await fetchText(stopsign_obj_URL);
    stopsign_obj = new sceneObject();
    parseObjects(stopsign_text, stopsign_obj, stopsign_mtl);
    stopsign_obj.objectName = "stopsign_obj";
    stopsign_obj.translateObjectPoints(1,0, 4);      //set the stop sign object position
    stopsign_obj.rotateObjectPoints(0, 1, 0, 180);
    stopsign_obj.shadowOn = true;
    //stopsign_obj.setParent(car_obj);
    console.log("stopsign_obj:", stopsign_obj);

    ///////////////////////////////////////////////////
    //4) street

    let street_text = await fetchText(street_obj_URL);
    street_obj = new sceneObject();
    parseObjects(street_text, street_obj, street_mtl);
    street_obj.objectName = "street_obj";
    console.log("street_obj:", street_obj);

    ///////////////////////////////////////////////////
    //5) street alt

    let street_alt_text = await fetchText(street_alt_obj_URL);
    street_alt_obj = new sceneObject();
    parseObjects(street_alt_text, street_alt_obj, street_alt_mtl);
    street_alt_obj.objectName = "street_alt_obj";
    console.log("street_alt_obj:", street_alt_obj);

    //////////////////////////////////////////////////
    //6) bunny

    let bunny_text = await fetchText(bunny_obj_URL);
    bunny_obj = new sceneObject();
    parseObjects(bunny_text, bunny_obj, bunny_mtl);
    bunny_obj.objectName = "bunny_obj";
    bunny_obj.translateObjectPoints(0,0.65, 1.8);    //set the bunny object position
    //bunny_obj.rotateObjectPoints(0, 1, 0, 90);        //set the bunny object rotation
    bunny_obj.setParent(car_obj);
    bunny_obj.shadowOn = false;
    bunny_obj.refractionOn = 1.0;
    console.log("bunny_obj:", bunny_obj);

    //////////////////////////////////////////////////
    //7) camera

    camera_obj = new generalObject();

    camera_obj.translateObjectPoints(0.4,1.0, 0.89);  //set the camera object position up on the hood and forwards
    camera_obj.rotateObjectPoints(0, 1, 0, 180);    //set the camera object rotation
    camera_obj.objectName = "camera_obj";
    camera_obj.setParent(car_obj);

    console.log("camera_obj:", camera_obj);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**make object array**/
    obj_array.push(car_obj);
    obj_array.push(lamp_obj);
    obj_array.push(stopsign_obj);
    obj_array.push(street_obj);
    obj_array.push(street_alt_obj);
    obj_array.push(bunny_obj);


    //handle the drawing the objects onto the screen component
    drawObjects();

}

/**
 * Function that draws the objects onto the screen using the global objects array
 */
function drawObjects(){


    gl.useProgram(program); //reset shader using before every frame
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let carXZ = 3.0; //3.5;   //multiplier for how big the car position circle is, if not the same term, gives ellipse instead of circle
    let carRotationAmount = 180;
    let carX;
    let carZ;
    let futureCarX;
    let futureCarZ;
    let angle;

    setCameraAndProjection();
    handleLighting();

    //go through all the objects
    for(let i= 0; i <obj_array.length; i++){

        //console.log("--------------Render generalObject Name:", obj_array[i].objectName);
        //console.log("generalObject:", obj_array[i]);
        //console.log("----------------------------------------------------");

        /*modelViewMatrix = obj_array[i].getTransformation();
        modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
        gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
         */

        //draw specific object
        render(obj_array[i].objectName, obj_array[i]);

    }

    //sin is sin wave, deltaT/2 Pi --> dividing time into discrete chunks of the full wave
    //cosine wave offsets it by one radian
    //lightPosition = [Math.sin(deltaT/ (2 * Math.PI)), Math.cos(deltaT/ (2 * Math.PI)), (Math.sin(deltaT* 2 / (2 * Math.PI)) * 0.8 + Math.cos(deltaT/ (2 * Math.PI)) * 0.35)];;

    //deltaT++;

    var timeOld = 0.0;


    //handle the Car Animation
    if(carAnimate) {

        let now = Date.now();


        //if camera is parented inside the car: --> at would change
        //let distanceAbove = 2.0;
        //setCameraAndProjection();

        //problem is tied to animation frame

        //whole seconds
        //deltaT = the distance between this current second & the next second (delta Time), time/time = 1
        //fraction between this current second and next second
        deltaT += ((now - start) / 1000) * rotationRate;     //every second this value would always add to one

        //rotations variant --> rotations per rotations, how many times you want the car to rotate every time car orbits track
        dAngle = (rotationVariant * 360) * deltaT;  //left side is how many rotations you want to do over a second


        //console.log("dAngle,", dAngle);

        //set rate of rotation per second, then derive rotation amount by time
        //always going to be based on a timescale, because the rate of time is a constant

        //carDelta += 0.1;

        //orig
        carX = Math.sin(deltaT * (2 * Math.PI)) * carXZ;
        carZ = Math.cos(deltaT * (2 * Math.PI)) * carXZ;

        let rotationOffset = 90;
        car_obj.setPosition(carX, 0.0, carZ);   //want to rotate in xz plane, so set y=1.0
        car_obj.setRotation(0.0, 1.0, 0.0, dAngle + rotationOffset);

        start = now;

    }


    //do skybox drawing below
    gl.useProgram(skyboxProgram);

    //put information into a different program
    /**
     * positions
     */
    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, skyboxPositions, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(skyboxProgram,  "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    /**
     * projection
     */
    let projectionMatrixLoc = gl.getUniformLocation( skyboxProgram, "projectionMatrix" );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    /**
     * camera
     */

    let cameraMatrixLoc = gl.getUniformLocation(skyboxProgram, "cameraMatrix");
    //gl.uniformMatrix4fv(cameraMatrixLoc, false, flatten(cameraMatrix));
    gl.uniformMatrix4fv(cameraMatrixLoc, false, flatten(cameraMatrix));

    gl.disable(gl.CULL_FACE);
    gl.drawArrays(gl.TRIANGLES, 0, skyboxPositions.length / 3);
    gl.enable(gl.CULL_FACE);

    gl.useProgram(program);
    requestAnimationFrame(drawObjects);

}



/**
 * Function that takes care of the static projections:
 * camera matrix & projection matrix
 */
function setCameraAndProjection(){

    //uploading the uniforms at every frame it is called

    //handle projection matrix
    projectionMatrix = perspective(60, aspect, near, far);
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );

    //handle camera matrix
    if(parentCameraToCar){
        cameraMatrix = inverse(camera_obj.getTransformation());  //recursive, so don't want to access parent's position directly
    } else{
        cameraMatrix = lookAt(eye, at, up);
    }
    cameraMatrixLoc = gl.getUniformLocation(program, "cameraMatrix");
    gl.uniformMatrix4fv(cameraMatrixLoc, false, flatten(cameraMatrix));
}

/**
 * Handles the lighting elements in the canvas
 */
function handleLighting(){

    //ambientLighting

    //Diffuse colors in the form “Kd [R] [G] [B]”
    //Specular colors in the form “Ks [R] [G] [B]”
    //A diffuse texture map in the form “map_Kd [Map Image]”

    //gl.uniform3fv(gl.getUniformLocation(program, "lightPosition"), [0.0, 8.0, 0.0]);
    gl.uniform3fv(gl.getUniformLocation(program, "lightPosition"), lightPosition);
    gl.uniform1i(gl.getUniformLocation(program, "toggleLightOn"), lightingOn? 1: 0);   //1i --> int
    //gl.uniform1f(gl.getUniformLocation(program, "toggleReflectionOn"), reflectionOn? 1: 0);   //1i --> int
    //gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

/**
 * Renders a specific object for a given object name
 * @param objectName the name of the object we want to render
 * @param object the object we want to render
 */
function render(objectName, object){

    //see if there's a texture in the object
    if(object.correspondingMTL.textureMap_URL != null){
        object.correspondingMTL.bindTexture();

    }


    //moved to before render is called, because webgl was complaining about modelViewMatrix not being declared
    modelViewMatrix = object.getTransformation();
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );


    //order that these parts go should be in the same order in the shader
    /**
     * position
     */

    //console.log("vertices", object.triangulated_positionVertices);
    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(object.triangulated_positionVertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program,  "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    /**
     * normals - buffer
     */

    //console.log("normals", object.triangulated_vertexNormals);
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(object.triangulated_vertexNormals), gl.STATIC_DRAW);

    let vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    /**
     * diffuse colors - buffer
     */

    //console.log("diffuse", object.triangulated_diffuseColors);
    var diffuseCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, diffuseCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(object.triangulated_diffuseColors), gl.STATIC_DRAW );

    var vColorDiffuse = gl.getAttribLocation( program, "vColorDiffuse" );
    gl.vertexAttribPointer( vColorDiffuse, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorDiffuse );


    /**
     * specular colors - buffer
     */

    //console.log("specular", object.triangulated_specularColors);
    var specularCBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, specularCBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(object.triangulated_specularColors), gl.STATIC_DRAW );

    var vColorSpecular = gl.getAttribLocation( program, "vColorSpecular" );
    gl.vertexAttribPointer( vColorSpecular, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColorSpecular );


    /**
     * texture coordinates - buffer
     */

    //console.log("vertices", object.triangulated_textureCoordinates);
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(object.triangulated_textureCoordinates), gl.STATIC_DRAW);

    let vTexture = gl.getAttribLocation( program, "vTexture" );
    gl.vertexAttribPointer( vTexture, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexture );


    //for the regular objects, always want it to be regular
    gl.uniform1i(gl.getUniformLocation(program, "toggleShadowsOn"), 0);   //1i --> int

    if((object.reflectionOn > 0.0 && reflectionOn)){
        //console.log("object", object.objectName);
        //console.log("object.reflectionOn", object.reflectionOn);
    }


    //turn refraction on and off per object
    let isRefractionOn =  refractionOn==true? object.refractionOn : 0.0 ;
    gl.uniform1f(gl.getUniformLocation(program, "toggleRefractionOn"), isRefractionOn);   //1i --> int


    //turn reflections on and off per object
    let isReflectionOn =  reflectionOn==true? object.reflectionOn : 0.0 ;
    //handle reflections
    gl.uniform1f(gl.getUniformLocation(program, "toggleReflectionOn"), isReflectionOn);   //1i --> int


    //Draw arrays call to render the object
    gl.drawArrays(gl.TRIANGLES, 0, object.triangulated_positionVertices.length / 3);



    //turn shadows on and off per object
    let shadowsEnabled = (object.shadowOn == true) && shadowsOn;
    //create shadow + draw it after object is drawn --> for car and stopsign only
    gl.uniform1i(gl.getUniformLocation(program, "toggleShadowsOn"), shadowsEnabled? 1: 0);   //1i --> int

    if (shadowsEnabled){       //if the shadowOn value for the object was set to be true;

        m = mat4();
        m[3][3] = 0;
        m[3][1] = -1/lightPosition[1];


        //add the offsets to make the shadows not be directly under the light source

        shadowMatrix = translate(lightPosition[0] + object.positionX, lightPosition[1] + object.positionY, lightPosition[2] + object.positionZ);
        //shadowMatrix = translate(0.0, 1.0, 0.0);
        shadowMatrix = mult(shadowMatrix, m);
        shadowMatrix = mult(shadowMatrix, translate(-lightPosition[0] - object.positionX, -lightPosition[1] - object.positionY, -lightPosition[2] - object.positionZ));

        let shadowPosition = translate(object.positionX, object.positionY, object.positionZ);
        shadowPosition = mult(shadowPosition,  rotate(object.rotationW, [0,1,0]));

        //let shadowPosition = mult(modelViewMatrix, translate(0.0, 0.0, 0.0));
        modelViewShadowMatrix = mult(shadowPosition , shadowMatrix);

        modelViewShadowMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
        gl.uniformMatrix4fv( modelViewShadowMatrixLoc, false, flatten(modelViewShadowMatrix) );
        //gl.vertexAttribPointer( vColorDiffuse, 3, gl.FLOAT, false, 0, 0 );
        //gl.enableVertexAttribArray( vColorDiffuse );


        gl.drawArrays(gl.TRIANGLES, 0, object.triangulated_positionVertices.length / 3);

    }



}


function configureCubeMap() {
    cubeMap = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    //image loading function called

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, red);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, yellow);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, green);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, cyan);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, blue);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, magenta);

    gl.useProgram(program);
    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 1);

    gl.useProgram(skyboxProgram);
    gl.uniform1i(gl.getUniformLocation(skyboxProgram, "texMap"), 1);
}


function configureCubeMapImage(skybox_negx, skybox_negy, skybox_negz, skybox_posx, skybox_posy, skybox_posz){
    cubeMap = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, skybox_negx);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, skybox_negy);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, skybox_negz);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, skybox_posx);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, skybox_posy);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, skybox_posz);

    gl.useProgram(program);
    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 1);

    gl.useProgram(skyboxProgram);
    gl.uniform1i(gl.getUniformLocation(skyboxProgram, "texMap"), 1);
}




