import * as mat4 from '../glsl/mat4';
import { Shape } from './Settings';
import * as vertices from './vertices';

export function getProgramInfo(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WEBGL.PropramInfoResult {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  return programInfo;
}


function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  // Send the source to the shader object
  gl.shaderSource(shader, source);
  // Compile the shader program
  gl.compileShader(shader);
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function createdContext(): WebGLRenderingContext {
  const canvas: HTMLCanvasElement = document.querySelector("#glCanvas");
  let gl = canvas.getContext("webgl") || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.log("Unable to initialize WebGL. Your browser or machine may not support it.");
    return null;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  return gl;
}

export function setBuffersAndAttributes(gl: WebGLRenderingContext, programInfo: any, buffer: WEBGL.BufferVertices):void {

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.position), gl.STATIC_DRAW);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  if (buffer.color){
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.color), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  if(buffer.indices){
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffer.indices), gl.STATIC_DRAW); //there can not be Float32Array

  }
}

export function drawRenderingInit(gl: WebGLRenderingContext): Float32Array {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  return projectionMatrix;
}

export function getDrawObject(type, programInfo: WEBGL.PropramInfoResult): WEBGL.DrawObject[] {
  let result: WEBGL.DrawObject[] = [];
  const config:WEBGL.Vertices3 = {
    x: 0 + random(2), y: 0 + random(2), z: 0 + random(1)
  }
  if (type === Shape.Pyramid) {
    const buffers = vertices.createTrianglePyramidVertices(1, config);
    const object: WEBGL.DrawObject = {
      programInfo, buffers, type,
      ...getVerticesAnimate(),
      vertexCount: 12,
    }
    result.push(object)
  }
  else if (type === Shape.Cube) {
    const buffers = vertices.createCubeVertices(0.5, config);
    const object: WEBGL.DrawObject = {
      programInfo, buffers, type,
      ...getVerticesAnimate(),
      vertexCount: 36,
    }
    result.push(object)
  }
  else if(type === Shape.PyramidSolid) {
    const buffers = vertices.createTrianglePyramidSolidVertices(1, config);
    const object: WEBGL.DrawObject = {
      programInfo, buffers, type,
      ...getVerticesAnimate(),
      vertexCount: 18,
    }
    result.push(object)
  }
  else if (type === Shape.Circle) {
    const buffers = vertices.createCircleVertices(1);
    const object: WEBGL.DrawObject = {
      programInfo, buffers, type,
      ...getVerticesAnimate(),
      vertexCount: buffers.indices.length,
    }
    result.push(object)
  }
  else if (type === Shape.Sphere) {
    const buffers = vertices.createSphereVertices(1);
    const object: WEBGL.DrawObject = {
      programInfo, buffers, type,
      ...getVerticesAnimate(),
      vertexCount: buffers.indices.length,
    }
    result.push(object)
  }
  return result;
}

function getVerticesAnimate() {
  let translate = random(10);
  if (translate <= 3)
    translate = 3;
  return {
    translateVector: [0, 0, -translate],
    rotateRadians: translate / 10,
    rotateAxis: [random(1, true), random(1, true), random(1, true)],
  }
}

export function random(max:number, zero:boolean = false):number{
  let result = Math.random();
  if (zero){
    return Math.ceil(result * 10000) % (max + 1)
  } else if (max === 1)
    return result;
  else
    return result * 10000 % max;
}


const trueColor = [0, 0.2, 0.4, 0.6, 0.8, 1];
//随机生成顶点颜色
export function randomVerticeColor(alpha:boolean = false): number[] {
  return [trueColor[Math.ceil(Math.random() * 10000) % trueColor.length], trueColor[Math.ceil(Math.random() * 10000) % trueColor.length], 
    trueColor[Math.ceil(Math.random() * 10000) % trueColor.length], alpha ? random(1) : 1]
}