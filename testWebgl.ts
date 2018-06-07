import * as webglUtils  from './webgl/webglUtils';
import { createTrianglePyramidVertices, createSquareVertices, bufferVertices } from './webgl/vertices';
import { fsSource, vsSource } from './webgl/glslSource';
import * as mat4 from './glsl/mat4';

enum Shape{
  Pyramid,
  Square,
}

interface DrawObject{
  programInfo: webglUtils.PropramInfoResult;
  buffers: bufferVertices;
  translateVector: number[];
  rotateRadians?: number;
  rotateAxis?: number[];
  colorMult: number[];
  type: Shape;
}

class WebGL {

  gl: WebGLRenderingContext;
  mRotation = 0.0;
  objectsToDraw: DrawObject[] = [];

  constructor() {
    this.gl = webglUtils.createdContext();
    let shaderProgram = webglUtils.getProgramInfo(this.gl, vsSource, fsSource);
    //shaderProgram.uniformLocations.colorMult = this.gl.getUniformLocation(shaderProgram, 'uColorMult');

    const buffers = createTrianglePyramidVertices(1);
    this.objectsToDraw.push({
      programInfo: shaderProgram, buffers, translateVector: [0, 0, -3.0], rotateRadians: 0.7, rotateAxis: [ 1, 1, 0],
      colorMult: [0.5, 1, 0.9, 1], type:Shape.Pyramid
    })

    const buffers2 = createTrianglePyramidVertices(1, {x: 1});
    this.objectsToDraw.push({
      programInfo: shaderProgram, buffers: buffers2, translateVector: [0, 0, -4.0], rotateRadians: 0.5, rotateAxis: [0, 1, 1],
      colorMult: [0.9, 0.2, 0.5, 1], type: Shape.Pyramid
    })

    const buffers3 = createSquareVertices(1);
    this.objectsToDraw.push({
      programInfo: shaderProgram, buffers: buffers3, translateVector: [0, 0, -3.0], rotateRadians: 0.7, rotateAxis: [1, 1, 0],
      colorMult: [0.9, 0.2, 0.5, 1], type: Shape.Square
    })

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

       
      webglUtils.setBuffersAndAttributes(this.gl, e.programInfo, e.buffers);
      // Tell WebGL to use our program when drawing
      gl.useProgram(e.programInfo.program);
      // Set the shader uniforms
      gl.uniformMatrix4fv(e.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(e.programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
      //gl.uniform4fv(e.programInfo.uniformLocations.colorMult, e.colorMult);

      let vertexCount;
      if(e.type === Shape.Pyramid){
        vertexCount = 12;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
      }
      else if (e.type === Shape.Square) {
        vertexCount = 6;
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
      }

     
    })

    // Update the rotation for the next draw
    this.mRotation += deltaTime;
  }

}

new WebGL();