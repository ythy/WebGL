import * as webglUtils  from './webgl/webglUtils';
import { createTrianglePyramidVertices, createSquareVertices } from './webgl/vertices';
import { fsSource, vsSource } from './webgl/glslSource';
import * as mat4 from './glsl/mat4';
import { Shape } from './webgl/Settings';

const shapes = [Shape.PyramidSolid, Shape.Pyramid, Shape.Cube, Shape.Circle, Shape.Sphere]//Shape.PyramidSolid, Shape.Pyramid

class WebGL {

  gl: WebGLRenderingContext;
  mRotation = 0.0;
  objectsToDraw: WEBGL.DrawObject[] = [];

  constructor() {
    this.gl = webglUtils.createdContext();
    let shaderProgram = webglUtils.getProgramInfo(this.gl, vsSource, fsSource);
    //shaderProgram.uniformLocations.colorMult = this.gl.getUniformLocation(shaderProgram, 'uColorMult');
    
    let count = 5;
    while(count-- > 0){
      this.objectsToDraw.push(...webglUtils.getDrawObject(shapes[count % shapes.length], shaderProgram));
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