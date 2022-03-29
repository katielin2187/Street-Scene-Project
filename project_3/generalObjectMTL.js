/**
 * A Class that stores the MTL data for objects in the scene:
 * ie. generalObjectMTL
 */
class generalObjectMTL{

    mtlName = null;
    correspondingObject = null;
    textureMap_URL = null;
    textureID = null;
    textureID_array = [];

    constructor() {

    }

    //Methods

    /**
     * Function that when given an url of an image, creates a texture and
     * binds it to be sent to the graphics card to process
     * @param textureURL url of image
     */
    createAndConfigureATexture(textureURL, gl) {

        this.textureMap_URL = textureURL;
        // Create a texture.
        var texture = gl.createTexture();           //allocate memory, return an integer representing a unique ID for the texture in gpu memory
        this.textureID = texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);     //activates it and sets the newly created as

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 255, 255, 255]));

        console.log("textureURL:", textureURL);

        // Asynchronously load an image
        var image = new Image();                    //html image, trying to get binary data representing pic out of it
        image.crossOrigin = "";
        image.src = textureURL;                     //listening for retrieval
        image.onload = function() {     //part will await for if loading strangely
            // Now that the image has loaded make copy it to the texture.
            console.log("image:", image);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);  //giving a big buffer in terms of image, image is an array of texture data
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        };

        //for the filtering, specifies how to do texture up-scaling to interpolate the fixed texture
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);     //down-sampling, can be nearest (hard edges) or linear (smoother)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);     //up-sampling

    }


    /**
     * Function that binds a texture that we already want to use,
     * using the data already in the graphics card
     * @param textureID the texture id of the texture we already have in memory
     */
    bindTexture() {


        gl.activeTexture(gl.TEXTURE0);  //one (the base one) of 32 places of the texture unit that is in graphics card
        //gl.activeTexture(gl.TEXTURE0 + 1); now using gl Texture 1 instead of 0
        gl.bindTexture(gl.TEXTURE_2D, this.textureID);   //have texture in memory, want that to be current active texture

        gl.uniform1i(gl.getUniformLocation(program, "textureDiffuse"), 0);  //0, matching one to one, tells it to use gl.TEXTURE0
        //if you want to use multiple:
        //gl.uniform1i(gl.getUniformLocation(program, "textureDiffuse"), 1); --> becomes 1 to link it, can do up to 32 times

    }


    /**
     * Function that when given an array of urls of images, creates a texture and
     * binds it to be sent to the graphics card to process for each image
     * @param textureURLArray array of urls of images
     */
    createAndConfigureMultipleTextures(textureURLArray, numberOfTextures, gl) {

        for(let i=0; i< numberOfTextures; i++){

            this.textureMap_URL = textureURLArray[i];
            // Create a texture.
            var texture = gl.createTexture();           //allocate memory, return an integer representing a unique ID for the texture in gpu memory
            this.textureID_array.push(texture);
            gl.bindTexture(gl.TEXTURE_2D, texture);     //activates it and sets the newly created as

            // Fill the texture with a 1x1 blue pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 255, 255, 255]));

            console.log("textureURL:", textureURLArray[i]);

            // Asynchronously load an image
            var image = new Image();                    //html image, trying to get binary data representing pic out of it
            image.crossOrigin = "";
            image.src = textureURLArray[i];                     //listening for retrieval
            image.onload = function() {     //part will await for if loading strangely
                // Now that the image has loaded make copy it to the texture.
                console.log("image:", image);
                gl.bindTexture(gl.TEXTURE_2D, texture, i);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);  //giving a big buffer in terms of image, image is an array of texture data
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            };

            //for the filtering, specifies how to do texture up-scaling to interpolate the fixed texture
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);     //down-sampling, can be nearest (hard edges) or linear (smoother)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);     //up-sampling


        }


    }


    /**
     * Function that binds a texture that we already want to use,
     * using the data already in the graphics card
     * @param textureNumberInArray the texture id of the texture we already have in memory
     */
    bindMultipleTexture(textureNumberInArray) {


        gl.activeTexture(gl.TEXTURE0);  //one (the base one) of 32 places of the texture unit that is in graphics card
        //gl.activeTexture(gl.TEXTURE0 + 1); now using gl Texture 1 instead of 0
        gl.bindTexture(gl.TEXTURE_2D, this.textureID_array[textureNumberInArray]);   //have texture in memory, want that to be current active texture

        gl.uniform1i(gl.getUniformLocation(program, "textureDiffuse"), textureNumberInArray);  //0, matching one to one, tells it to use gl.TEXTURE0
        //if you want to use multiple:
        //gl.uniform1i(gl.getUniformLocation(program, "textureDiffuse"), 1); --> becomes 1 to link it, can do up to 32 times

    }



}