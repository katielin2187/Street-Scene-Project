//parse mtls

/**
 * Function that given a url parses the contents and places it
 * into a sceneObjectMTL and returns the sceneObjectML.
 *
 * @param url the text contents of object we want to extract
 *             data from an store in a scene object mtl
 */
function parseMTLs(text, sceneObjectMTL){

    //console.log("/////---in parseMTLs()---/////")
    const materials = {};
    let material;

    var diffuseColors = [];
    var specularColors = [];
    var diffuseTextureMap = [];

    let prevNewMTLKeyword = null;   //keep track of previous useMaterial Keyword to compare to when storing data
    let tempMTL = null;
    const keywords = {};


    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    let parsedLine;

    //parse in file contents
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
        parsedLine = mtlKeywordHandler(line, keyword, unparsedArgs);

        storeMTLDataFromParsing(keyword, parsedLine, tempMTL, prevNewMTLKeyword, sceneObjectMTL);

    }   //end of for loop

    //console.log("-----sceneObjectMTL", sceneObjectMTL);
    //console.log("---end of parseMTLs()");

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
function mtlKeywordHandler(line, keyword, unparsedArgs, diffuseColors, specularColors, diffuseTextureMap){

    switch(keyword){
        case 'Kd': //diffuseColors
            //console.log("------case Kd:");

            //get the v data for one single line
            let singleLineData_Kd = parseLineDataFrom1DArray(line);
            //console.log("--Kd--singleLineData_Kd", singleLineData_Kd);
            return singleLineData_Kd;
            break;

        case 'Ks': //specularColors;
            //console.log("-----case Ks:");

            //get the v data for one single line
            let singleLineData_Ks = parseLineDataFrom1DArray(line);
            //console.log("--Ks--singleLineData_Ks", singleLineData_Ks);
            return singleLineData_Ks;
            break;

        case 'map_Kd': //diffuseTextureMap;
            console.log("-----case map_Kd:");

            //get the v data for one single line
            let singleLineData_map_Kd = line;
            console.log("--map_Kd--singleLineData_map_Kd", singleLineData_map_Kd);
            return singleLineData_map_Kd;
            break;

        case 'newmtl': //materials
            //console.log("-----case newmtl:");

            //get the f data for one single line
            let singleLineData_newmtl = unparsedArgs;
            //console.log("--f--singleLineData_newmtl", singleLineData_newmtl);
            //console.log("!!!!newmtl", unparsedArgs);
            return singleLineData_newmtl;
            break;

        default:
            break;
    }   //end of switch statement
    //console.log("---end of mtlKeywordHandler()");
}

/**
 * Function that takes in the various object data arrays and
 * populated them with the parsed data
 *
 * @param keyword the keyword of the data type being stored
 * @param parsedLine the line we want to parse and extract data from
 * @param tempMTL temporary mtl object to be made and pushed to mtl array
 * @param prevNewMTLKeyword previous new material keyword
 * @param sceneObjectMTL object we want to parse and store data into
 */
function storeMTLDataFromParsing(keyword, parsedLine, tempMTL, prevNewMTLKeyword, sceneObjectMTL){

    let currentMTLIndex = sceneObjectMTL.mtls.length - 1;
    let currentMTL = sceneObjectMTL.mtls[currentMTLIndex];

    switch(keyword){
        case 'Kd': //diffuseColors

            //console.log("------case Kd:");
            //push parsedLine to diffuseColors array
            //diffuseColors.push(parsedLine);

            currentMTL.diffuseColors.push(parsedLine);
            break;

        case 'Ks': //specularColors;

            //console.log("-----case Ks:");
            //push parsedLine to specularColors array
            //specularColors.push(parsedLine);

            currentMTL.specularColors.push(parsedLine);
            break;

        case 'map_Kd': //diffuseTextureMap;

            console.log("-----case map_Kd:");
            //push parsedLine to diffuseTextureMap array
            //diffuseTextureMap.push(parsedLine);
            console.log("parseLine:", parsedLine);

            currentMTL.diffuseTextureMap = parsedLine;
            break;

        case 'newmtl': //new material

            //console.log("-----case newmtl:");
            //push parsedLine to faces array
            //faces.push(parsedLine);

            //not sure if i even need prevKeyword variable...
            prevNewMTLKeyword = keyword;   //keep track of the useMaterial keyword when storing faces
            tempMTL = new mtl();      //new temporary material object to be stored in sceneObject
            //material object has, a useMaterial statement + its corresponding faces
            tempMTL.newMTL = parsedLine;
            tempMTL.diffuseColors = [];
            tempMTL.specularColors = [];
            tempMTL.diffuseTextureMap = null;

            sceneObjectMTL.mtls.push(tempMTL);

            //console.log("tempMTL:", tempMTL);
            //console.log("sceneObjectMTL:", sceneObjectMTL);
            break;

        default:
            break;
    }   //end of switch statement
    //console.log("---end of storeMTLDataFromParsing()");
}