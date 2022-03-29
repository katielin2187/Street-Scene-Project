//parse objects

let currentMaterial;

/**
 * Function that given a url parses the contents and places it
 * into a sceneObject and returns the sceneObject.
 *
 * @param text the text contents of object we want to extract
 *             data from and store in a scene object
 * @param sceneObject the object we want to parse and store data into.
 * @param correspondingMTL the corresponding mtl object we want to store in the object
 */
function parseObjects(text, sceneObject, correspondingMTL){

    //console.log("/////---in parseObjects()---/////")

    let mtls = correspondingMTL.mtls;

    let positionVertices = [];
    let textureCoordinates = [];
    let vertexNormals = [];
    let materials = [];                  //an array of material objects
                                         //material object has, a useMaterial statement + its corresponding faces
    let prevUseMaterialKeyword = null;   //keep track of previous useMaterial Keyword to compare to when storing data
    let tempMaterial = null;
    const keywords = {};

    // process text of the file (as a string) here
    //console.log("current text: ", text);

    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    let parsedLine;

    //parse in file contents, parsing is done line by line, one at a time
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i].trim();
        if (line === '' || line.startsWith('#')) {
            continue;
        }
        const m = keywordRE.exec(line); //searches for match in a string
        if (!m) {
            continue;
        }

        const [, keyword, unparsedArgs] = m;
        //console.log("------BEFORE PARSING:");
        //console.log('---keyword:', keyword, 'at line', i + 1, "---unparsedArgs:", unparsedArgs);

        //switch statement that handles the arguments inside the keywords
        parsedLine = objectKeywordHandler(line, keyword, unparsedArgs);

        storeObjectDataFromParsing(keyword, parsedLine, prevUseMaterialKeyword, sceneObject, mtls);

    }   //end of for loop

    sceneObject.setAndTriangulateMaterialData();

    //link object & street mtl object, because passed parameters are mutable
    sceneObject.correspondingMTL = correspondingMTL;
    correspondingMTL.correspondingObject = sceneObject; //parameters in javascript are mutable
    //console.log("-----sceneObject", sceneObject); //omg it works i think

    //console.log("---end of parseObjects()");

}


/**
 * Function that takes in the line that we want to parse,
 * the keyword that corresponds to that line, and the
 * remaining unparsed arguments and then proceeds to
 * parse and store the individual data into the
 * corresponding object
 *
 * @param line the line we want to parse
 * @param keyword the keyword of the data type being stored
 * @param unparsedArgs the remaining unparsed arguments
 */
function objectKeywordHandler(line, keyword, unparsedArgs){

    let currentColor;

    switch(keyword){
        case 'v': //vertices
            //console.log("------case v:");

            //get the v data for one single line
            let singleLineData_v = parseLineDataFrom1DArray(line);
            //console.log("--v--singleLineData", singleLineData_v);
            return singleLineData_v;
            break;

        case 'vt': //textureCoordinates;
            //console.log("-----case vt:");

            //get the v data for one single line
            let singleLineData_vt = parseLineDataFrom1DArray(line);
            //console.log("--vt--singleLineData", singleLineData_vt);
            return singleLineData_vt;
            break;

        case 'vn': //vertexNormals;
            //console.log("-----case vn:");

            //get the v data for one single line
            let singleLineData_vn = parseLineDataFrom1DArray(line);
            //console.log("--vn--singleLineData", singleLineData_vn);
            return singleLineData_vn;
            break;

        case 'f': //face data
            //console.log("-----case f:");

            //every time you make a face, push currently loaded material
            //three times in that triangle
            //1) one array containing the vertices: an array of all the vertices triangulating as faces
            //2) for each of those vertices have the normals for the vertices, one-to-one mapping,
            //      position, normal, color, texture coordinates
            //3) color array
            //4) texture coordinates

            //get the f data for one single line
            let singleLineData_f = parseLineDataFrom2DArray(line);
            //console.log("--f--singleLineData", singleLineData_f);
            return singleLineData_f;
            break;

        case 'usemtl':

            //console.log("-----case usemtl:");
            //set current color to what it is telling you to use


            //get the f data for one single line
            let singleLineData_usemtl = unparsedArgs;
            //console.log("--usemtl--singleLineData", singleLineData_usemtl);
            return singleLineData_usemtl;
            break;

        default:
            break;

    }   //end of switch statement

}

/**
 * Function that takes in the various object data arrays and
 * populated them with the parsed data
 *
 * @param keyword the keyword of the data type being stored
 * @param parsedLine the line we want to parse and extract data from
 * @param prevUseMaterialKeyword the previous keyword that was last used
 * @param sceneObject the object we want to store data in
 * @param mtls the list of materials
 */
function storeObjectDataFromParsing(keyword, parsedLine, prevUseMaterialKeyword, sceneObject, mtls){

    switch(keyword){
        case 'v': //vertices

            //console.log("------case v:");
            //push parsedLine to positionVertices array
            // positionVertices.push(parsedLine);
            sceneObject.positionVertices.push(parsedLine);
            break;

        case 'vt': //textureCoordinates;

            //console.log("-----case vt:");
            //push parsedLine to textureCoordinates array
            //textureCoordinates.push(parsedLine);
            sceneObject.textureCoordinates.push(parsedLine);
            break;

        case 'vn': //vertexNormals;

            //console.log("-----case vn:");
            //push parsedLine to vertexNormals array
            //vertexNormals.push(parsedLine);
            sceneObject.vertexNormals.push(parsedLine);
            break;

        case 'f': //face data

            //console.log("-----case f:");
            //push parsedLine to faces array
            //faces.push(parsedLine);

            //if the tempMaterial object is initialized, and the useMaterial field
            //is equal to the previously save useMaterial keyword, then add the parsed
            //console.log("parsed line f", parsedLine);
            //data into the tempMaterial object
            sceneObject.faces.push(parsedLine);
            sceneObject.faceMaterials.push(currentMaterial);
            break;

        case 'usemtl':

            //console.log("-----case usemtl:");
            //push parsedLine to useMaterialStatements array
            //useMaterialStatements.push(parsedLine);

            prevUseMaterialKeyword = keyword;   //keep track of the useMaterial keyword when storing faces

            //currentColor = parsedLine;
            for(let i=0; i<mtls.length;i++){
                if(parsedLine === mtls[i].newMTL){
                    currentMaterial = mtls[i];
                }
            }

            //console.log("sceneObject:", sceneObject);

        default:
            break;

    }   //end of switch statement

}