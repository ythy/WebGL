declare namespace WEBGL{

  export interface DrawObject {
    programInfo: PropramInfoResult;
    buffers: BufferVertices;
    translateVector: number[];
    rotateRadians?: number;
    rotateAxis?: number[];
    colorMult?: number[];
    type: Shape;
    vertexCount?:number;
  } 

  export interface PropramInfoResult {
    program: WebGLProgram;
    attribLocations: {
      [x: string]: number;
      vertexPosition?: number;
      vertexColor?: number;
    },
    uniformLocations: {
      [x: string]: WebGLUniformLocation;
      projectionMatrix?: WebGLUnsiformLocation;
      modelViewMatrix?: WebGLUniformLocation;
    }
  }

  export interface BufferVertices {
    position: number[];
    color?: number[];
    indices?: number[];
  }

  export interface Vertices3 {
    x?: number;
    y?: number;
    z?: number;
  }
}