
/**
 * A Class that stores the object data for objects in the scene:
 * ie. generalObjects
 */
class generalObject {

    objectName = null;

    parent = null; //a parent can be a sceneObject

    transformation = mat4();
    positionX = 0.0;
    positionY = 0.0;
    positionZ = 0.0;

    rotationX = 0.0;
    rotationY = 0.0;
    rotationZ = 0.0;
    rotationW = 0.0;

    scaleX = 1.0;
    scaleY = 1.0;
    scaleZ = 1.0;

    constructor() {
    }

    // Methods

    /**
     *  Sets the position parameters of the object
     * @param x position
     * @param y position
     * @param z position
     */
    setPosition(x, y, z){

        //override the translation in the matrix
        this.transformation[0][3] = x;  //[which vector][which part of vector]
        this.transformation[1][3] = y;
        this.transformation[2][3] = z;

        this.positionX = x;
        this.positionY = y;
        this.positionZ = z;
    }

    /**
     * Sets the rotation parameters of the object
     * @param x 1.0, if axis is being rotated, 0.0 if not being rotated
     * @param y 1.0, if axis is being rotated, 0.0 if not being rotated
     * @param z 1.0, if axis is being rotated, 0.0 if not being rotated
     * @param w degrees of rotation
     */
    setRotation(x, y, z, w){
        this.transformation = mult(mat4(), translate(this.positionX, this.positionY, this.positionZ));
        this.scaleObjectPoints(this.scaleX, this.scaleY, this.scaleZ);
        this.transformation = mult(this.transformation,  rotate(w, [x,y,z]));
        this.rotationW = w;

    }

    /**
     * Function that returns the currently set transformation matrix for the object
     * @returns the transformation matrix
     */
    getTransformation(){

        //if the object has a parent : give same transformations as parent
        if(this.parent){
            let parentTransformation = mult(this.parent.getTransformation(), this.transformation);
            this.positionX = this.parent.positionX;
            this.positionY = this.parent.positionY;
            this.positionZ = this.parent.positionZ;

            this.rotationX = this.parent.rotationX;
            this.rotationY = this.parent.rotationY;
            this.rotationZ = this.parent.rotationZ;
            this.rotationW = this.parent.rotationW;

            this.scaleX = this.parent.scaleX;
            this.scaleY = this.parent.scaleY;
            this.scaleZ = this.parent.scaleZ;
            //

            return mult(this.parent.getTransformation(), this.transformation);

        }

        return this.transformation;
    }


    /**
     * Function that translates the object points to given position points
     * @param x position
     * @param y position
     * @param z position
     */
    translateObjectPoints(x, y, z){

        this.transformation = mult(this.transformation, translate(x, y, z));
        this.positionX += x;
        this.positionY += y;
        this.positionZ += z;
    }

    /**
     * Function that takes a degree and axis rotation info. and rotates the object
     * @param x 1.0, if axis is being rotated, 0.0 if not being rotated
     * @param y 1.0, if axis is being rotated, 0.0 if not being rotated
     * @param z 1.0, if axis is being rotated, 0.0 if not being rotated
     * @param w degrees of rotation
     */
    rotateObjectPoints(x, y, z, w){

        //rotate(angle, axis[x,y,z])
        this.transformation = mult(this.transformation,  rotate(w, [x,y,z]));
        this.rotationW = w;
    }

    /**
     * Function that scales the object to the given scale factors
     * @param x scale factor
     * @param y scale factor
     * @param z scale factor
     */
    scaleObjectPoints(x, y, z){

        this.transformation = mult(this.transformation,  scalem(x,y,z));
        this.scaleX = x;
        this.scaleY = y;
        this.scaleZ = z;
        /*
        this.scaleX *= x;
        this.scaleY *= y;
        this.scaleZ *= z;

         */
    }


    /**
     * Function that sets the parent of the current object by a given object.
     * This will create a recursive, reverse tree
     * @param sceneObject given object parent
     */
    setParent(sceneObject){
        this.parent = sceneObject;
    }


}