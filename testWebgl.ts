import * as webglUtils  from './webgl/webglUtils';
import { createTrianglePyramidVertices, createSquareVertices } from './webgl/vertices';
import { fsSource, vsSource, fsSourceTexture, vsSourceTexture } from './webgl/glslSource';
import * as mat4 from './glsl/mat4';
import { Shape } from './webgl/Settings';

const shapes = [Shape.PyramidSolid, Shape.Pyramid, Shape.Cube, Shape.Sphere];//Shape.PyramidSolid, Shape.Pyramid

class WebGL {

  gl: WebGLRenderingContext;
  mRotation = 0.0;
  objectsToDraw: WEBGL.DrawObject[] = [];
  moonTexture;

  constructor() {
    this.gl = webglUtils.createdContext();
    this.initTexture();
    //shaderProgram.uniformLocations.colorMult = this.gl.getUniformLocation(shaderProgram, 'uColorMult');
    
    let count = 4;
    while(count-- > 0){
      let shaderProgram;
      const shape = shapes[Math.ceil(Math.random() * 1000) % shapes.length];
      if (shape === Shape.Cube || shape === Shape.Sphere)
        shaderProgram = webglUtils.getProgramInfo(this.gl, vsSourceTexture, fsSourceTexture);
      else
        shaderProgram = webglUtils.getProgramInfo(this.gl, vsSource, fsSource);

      const object = webglUtils.getDrawObject(shape, shaderProgram)[0];
      this.objectsToDraw.push(object);
    } 
 

    let then = 0;
    // Draw the scene repeatedly
    const render = (now) => {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;
      this.drawScene(this.gl, deltaTime);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  handleLoadedTexture(texture) {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
  }

 initTexture() {
   this.moonTexture = this.gl.createTexture();
   this.moonTexture.image = new Image();
   this.moonTexture.image.onload = ()=> {
     this.handleLoadedTexture(this.moonTexture)
   }

   this.moonTexture.image.src = "./static/moon.gif";
  }


  private drawScene(gl: WebGLRenderingContext, deltaTime) {
    const projectionMatrix = webglUtils.drawRenderingInit(gl);

    this.objectsToDraw.forEach(e=>{
      // Set the drawing position to the "identity" point, which is
      // the center of the scene.
     

      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        e.translateVector);  // amount to translate

      if (e.rotateRadians)
        mat4.rotate(modelViewMatrix,  // destination matrix
          modelViewMatrix,  // matrix to rotate
          this.mRotation * e.rotateRadians,// amount to rotate in radians
          e.rotateAxis);       // axis to rotate around (X)

      const normalMatrix = mat4.create();
      mat4.invert(normalMatrix, modelViewMatrix);
      mat4.transpose(normalMatrix, normalMatrix);

       
      webglUtils.setBuffersAndAttributes(this.gl, e.programInfo, e.buffers);
      // Tell WebGL to use our program when drawing
      gl.useProgram(e.programInfo.program);
      // Set the shader uniforms
      gl.uniformMatrix4fv(e.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(e.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
      gl.uniformMatrix4fv(e.programInfo.uniformLocations.normalMatrix, false, normalMatrix);
      
      if(e.buffers.texture){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.moonTexture);
        gl.uniform1i(e.programInfo.uniformLocations.uSampler, 0);
      }
     

      let vertexCount = e.vertexCount;

      if (e.buffers.indices)
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
      else
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);  
      
    })

    // Update the rotation for the next draw
    this.mRotation += deltaTime;
  }

}

new WebGL();