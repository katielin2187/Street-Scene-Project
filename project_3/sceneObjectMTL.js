/**
 * A Class that stores the MTL data for objects in the scene:
 * ie. sceneMTL
 */
class sceneObjectMTL extends generalObjectMTL{

    mtls = [];     //an array of mtl objects

    constructor() {
        super();

    }

    /** Setters **/

    set mtls(inputMtls) {
        this.mtls.push(inputMtls);
    }

    //Methods

}