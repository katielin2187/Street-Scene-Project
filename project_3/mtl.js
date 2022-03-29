/**
 * A Class that stores the data for a given mtl in used in
 * a sceneObjectMTL object in a scene:
 * ie. sceneMTL
 */
class mtl{

    newMTL = null;
    diffuseColors = [];
    specularColors = [];
    diffuseTextureMap = null;

    constructor(newMTL, diffuseColors, specularColors, diffuseTextureMap) {
        this.newMTL = newMTL;
        this.diffuseColors = diffuseColors;
        this.specularColors = specularColors;
        this.diffuseTextureMap = diffuseTextureMap;
    }


    /** Setters **/
    set newMTL(inputNewMTL) {
        this.newMTL.push(inputNewMTL);
    }

    set diffuseColors(inputDiffuseColors) {
        this.diffuseColors.push(inputDiffuseColors);
    }

    set specularColors(inputSpecularColors) {
        this.specularColors.push(inputSpecularColors);
    }

    set diffuseTextureMap(inputDiffuseTextureMap) {
        this.diffuseTextureMap.push(inputDiffuseTextureMap);
    }

    //Methods

}