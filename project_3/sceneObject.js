
/**
 * A Class that stores the object data for objects in the scene:
 * ie. sceneObjects
 */
class sceneObject extends generalObject{

    //imported data
    faceMaterials = [];
    positionVertices = [];
    textureCoordinates = [];
    vertexNormals = [];
    faces = [];

    // organized data --> all of this data that is "organized_" prefix is
    // going to become data inside the different attributes inside the vertex data
    triangulated_diffuseColors = [];
    triangulated_specularColors = [];
    triangulated_positionVertices = [];
    triangulated_textureCoordinates = [];
    triangulated_vertexNormals = [];

    correspondingMTL = null;    // = new sceneObjectMTL();

    shadowOn = false;
    reflectionOn = 0.0;
    refractionOn = 0.0;

    constructor() {
        super();
    }

    // Methods

    /**
     * Function that takes the parsed material data and triangulates them and saves them in the  organized data
     */
    setAndTriangulateMaterialData(){

        let tempFaceComp_Vert = [];
        let tempFaceComp_Text = [];
        let tempFaceComp_Norm = [];

        /**set the data for the faceData array**/
        //run through all the faces
        for (let faceIndex=0; faceIndex< this.faces.length; faceIndex++){
            //run through a single face --> polygons, not triangles

            //this.faces[faceIndex] --> points on a polygon that need to be converted to a triangle
            //console.log("FACE PART:", this.faces[faceIndex]);

            // (- 2), for loop that runs for the number of triangles trying to make
            //in case there are three points provide, makes one triangle
            // in order to get the number of triangles, we take the number of points that make the polygon and subtract 2
            // ex. to get from 3 to 1, subtract 2, 4 points are going to make 2 triangles
            // subtract 2 is  a constant


            //run once per triangle, triangleIndexPerPolygon --> triangulation
            for (let triangleIndexPerPolygon=0; triangleIndexPerPolygon < this.faces[faceIndex].length - 2 ; triangleIndexPerPolygon++){

                //runs once for each vertex in the triangle (vertexInTriangle)
                //only ever 3 points on a triangle --> 3 is a constant
                for (let vertexInTriangle = 0; vertexInTriangle < 3; vertexInTriangle++){

                    let vertexIndex = triangleIndexPerPolygon + vertexInTriangle;

                    //use the zero index to triangulate, if it is the first time running
                    if(vertexInTriangle == 0){
                        vertexIndex = 0;
                    }

                    //vertices
                    this.triangulated_positionVertices.push(flatten([this.positionVertices[this.faces[faceIndex][vertexIndex][0] - 1]]));
                    //texture coords
                    this.triangulated_textureCoordinates.push(flatten([this.textureCoordinates[this.faces[faceIndex][vertexIndex][1] - 1]]));
                    //normals
                    this.triangulated_vertexNormals.push(flatten([this.vertexNormals[this.faces[faceIndex][vertexIndex][2] - 1]]));
                    //diffuse colors
                    let diffuse = this.faceMaterials[faceIndex].diffuseColors;
                    this.triangulated_diffuseColors.push(flatten(diffuse));
                    //specular colors
                    let specular = this.faceMaterials[faceIndex].specularColors;
                    this.triangulated_specularColors.push(flatten(specular));

                }
            }
        }


        let flattenedPositionVerticesData = []
        let flattenedTextureCoordinatesData = []
        let flattenedVertexNormalsData = []
        let flattenedDiffuseData = []
        let flattenedSpecularData = []

        //manually flattening the data
        for(let q=0; q< this.triangulated_positionVertices.length; q++){

            //flatten the position vertices data, the vertex normals data, and the color data
            for(let w=0; w< this.triangulated_positionVertices[q].length; w++){

                flattenedPositionVerticesData.push(this.triangulated_positionVertices[q][w]);
                flattenedVertexNormalsData.push(this.triangulated_vertexNormals[q][w]);
                flattenedDiffuseData.push(this.triangulated_diffuseColors[q][w]);
                flattenedSpecularData.push(this.triangulated_specularColors[q][w]);
            }

            for(let k=0; k< this.triangulated_textureCoordinates[q].length; k++){

                if(isNaN(this.triangulated_textureCoordinates[q][k])){
                    flattenedTextureCoordinatesData.push(0);
                    flattenedTextureCoordinatesData.push(0);
                } else{
                    flattenedTextureCoordinatesData.push(this.triangulated_textureCoordinates[q][k]);
                }

            }
        }

        this.triangulated_positionVertices = flattenedPositionVerticesData;
        this.triangulated_textureCoordinates = flattenedTextureCoordinatesData;
        this.triangulated_vertexNormals = flattenedVertexNormalsData;
        this.triangulated_diffuseColors = flattenedDiffuseData;
        this.triangulated_specularColors = flattenedSpecularData;

        /*
        console.log("flattenedPositionVerticesData", flattenedPositionVerticesData);
        console.log("flattenedTextureCoordinatesData", flattenedTextureCoordinatesData);
        console.log("flattenedVertexNormalsData", flattenedVertexNormalsData);
         */


    }

    /**
     * Takes a points array of vertices and converts it from a 3d array to a 2d array
     * @param verticesPointsArray 3d points array
     * @returns the 2d array version of the given array
     */
    convertVerticesData3dto2d(verticesPointsArray){

        let tempFaceArrayData = [];
        let faceArrayData = [];


        //take the array of arrays --> turn 3d array into 2d array
        //for all the faces
        for (let w = 0; w < verticesPointsArray.length; w++) {
            //for each face
            //console.log("***ty:");
            //console.log("verticesPointsArray[w]", verticesPointsArray[w]);
            for (let k = 0; k < verticesPointsArray[w].length; k++) {
                //for each points in the face
                //console.log("verticesPointsArray[w]", verticesPointsArray[w]);
                //console.log("***y:");
                for (let s = 0; s < verticesPointsArray[w][k].length; s++) {
                    //console.log("***tempFaceArrayData:");
                    tempFaceArrayData.push(verticesPointsArray[w][k][s]);
                    //console.log("***tempFaceArrayData:", verticesPointsArray[w][k][s]);
                }
            }
            faceArrayData.push(tempFaceArrayData);
            tempFaceArrayData = [];
        }

        //console.log("faceArrayData:", faceArrayData);
        return faceArrayData;
    }


}