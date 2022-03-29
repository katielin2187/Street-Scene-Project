//Utility Methods

/**
 * Function that fetches the given text from the given url
 * and returns it
 *
 * @param url the url address of the desired text
 * @returns {Promise<string>}
 */
async function fetchText(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text;
}

/**
 * Function that takes in a value and check to see
 * if it is a power of two
 * @param value
 * @returns {boolean} true if value is a power of 2
 */
function isPowerOf2(value) {
    let isPowerOf2 = (value & (value - 1)) == 0;
    return isPowerOf2;
}


/**
 * Function that takes in the 1D data of the line
 * that we want to parse and returns it parsed
 * and converted to float form
 *
 * @param line the line we want to parse
 * @returns {*[]} parsed arguments in float form
 */
function parseLineDataFrom1DArray(line){

    //split argument parts
    let parsedArgs = line.split(/\s+/).slice(1);
    //console.log("------splitParts", parsedArgs);

    let parsedArgs_floats = convertArrayElementsFromStrings(parsedArgs);
    //console.log("------parsedArgs_floats", parsedArgs_floats); //vertices

    return parsedArgs_floats;
}

/**
 * Function that takes in the 2D data of the line
 * that we want to parse and returns it parsed
 * and converted to float form
 *
 * @param line the line we want to parse
 * @returns {*[]} parsed arguments in float form
 */
function parseLineDataFrom2DArray(line){

    //split argument parts
    let mostlyParsedArgs = line.split(/\s+/).slice(1);
    //console.log("------splitParts", parsedArgs);

    let fullyParsedArgs = []
    let tempData = []

    //walk through parsedArgs array to parse unparsedArgs
    for (let i = 0; i<mostlyParsedArgs.length; i++){                 //array length4
        //extract from       -->    (dataA, dataB, dataC)
        // ex) in case 'f':         (v, vt, vn)  or  (v, //, vn)

        let [fullString, dataA, dataB, dataC] =  mostlyParsedArgs[i].match(/(.*)\/(.*)\/(.*)/);

        //console.log("----fullString:", fullString);
        //console.log("---- dataA:", dataA, ", dataB:", dataB, " ,dataC:", dataC);

        tempData = [dataA, dataB, dataC];
        fullyParsedArgs.push(tempData);
    }

    let parsedArguments_floats = convert2DArrayElementsFromStrings(fullyParsedArgs);
    //console.log("----parsedArguments_floats:", parsedArguments_floats);       //all data, float version

    return parsedArguments_floats;
}


/**
 * Function that takes in an array with string elements and
 * transforms it into an array of digits or floats
 *
 * @param givenArray the array that will be converted
 * @returns {*[]} a float version of the given array
 */
function convertArrayElementsFromStrings(givenArray){

    let temp;
    let floatArray = [];

    for(let i = 0; i< givenArray.length; i++){
        temp = parseFloat(givenArray[i]);
        floatArray.push(temp);
    }
    return floatArray;
}

/**
 *
 * Function that takes in a 2D array with string elements and
 * transforms it into a 2D array of digits or floats
 *
 * @param givenArray the 2D array that will be converted
 * @returns {*[]} a float version of the given 2D array
 */
function convert2DArrayElementsFromStrings(given2DArray){

    let temp;
    let floatArray = [];
    let convertedArray = [];

    for(let i = 0; i< given2DArray.length; i++){
        for(let j = 0; j<given2DArray[i].length; j++){
            temp = parseFloat(given2DArray[i][j]);
            floatArray.push(temp);

        }// end of j
        convertedArray.push(floatArray);
        floatArray = [];                 //reset faceVertexData after it is pushed

    }// end of i
    return convertedArray;
}

/**
 * Function that takes in a 3D array with string elements and
 * transforms it into a 3D array of digits or floats
 *
 * @param givenArray the 3D array that will be converted
 * @returns {*[]} a float version of the given 3D array
 */
function convert3DArrayElementsFromStrings(given3DArray){

    let temp;
    let floatArray = [];
    let floatArrays = [];
    let convertedArray = [];

    for(let i = 0; i< given3DArray.length; i++){
        for(let j = 0; j<given3DArray[i].length; j++){
            for (let k = 0; k<given3DArray[i][j].length; k++){
                temp = parseFloat(given3DArray[i][j][k]);
                floatArray.push(temp);

            }// end of k
            floatArrays.push(floatArray);
            floatArray = []

        }// end of j
        convertedArray.push(floatArrays);
        floatArrays = [];                 //reset faceVertexData after it is pushed

    }// end of i
    return convertedArray;
}


