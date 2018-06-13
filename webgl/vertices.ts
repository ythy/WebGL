import { randomVerticeColor } from './webglUtils';
import * as webglUtils from './webglUtils';

//金字塔形锥体
export function createTrianglePyramidVertices(size: number = 1.0, offset?: WEBGL.Vertices3): WEBGL.BufferVertices {
  const unit: number = 1.0 * size;
  const facePositions = [
    0.0, unit, 0.0,
    -unit, 0.0, 0.0,
    0.0, 0.0, unit,

    0.0, unit, 0.0,
    0.0, 0.0, unit,
    unit, 0.0, 0.0,

    0.0, unit, 0.0,
    unit, 0.0, 0.0,
    0.0, 0.0, -unit,

    0.0, unit, 0.0,
    0.0, 0.0, -unit,
    -unit, 0.0, 0.0,
  ];

  let finalPositoin = [];
  facePositions.forEach((v, i) => {
    const t = (i + 1) % 3;
    if (t === 1 && offset && offset.x)
      v = v + offset.x;
    else if (t === 2 && offset && offset.y)
      v += offset.y;
    else if (t === 0 && offset && offset.z)
      v += offset.z;
    finalPositoin.push(v);
  })

  const colors4 = [
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
  ];

  // Convert the array of colors into a table for all the vertices.
  let faceColors = [];
  for (let j = 0; j < colors4.length; ++j) {
    const c = colors4[j];
    faceColors = faceColors.concat(c, c, c);
  }

  return {
    position: finalPositoin,
    color: faceColors,
  };
}

//金字塔形锥体有底
export function createTrianglePyramidSolidVertices(size: number = 1.0, offset?: WEBGL.Vertices3): WEBGL.BufferVertices {
  const unit: number = 1.0 * size;
  const facePositions = [
    0.0, unit, 0.0,
    -unit, 0.0, 0.0,
    0.0, 0.0, unit,

    0.0, unit, 0.0,
    0.0, 0.0, unit,
    unit, 0.0, 0.0,

    0.0, unit, 0.0,
    unit, 0.0, 0.0,
    0.0, 0.0, -unit,

    0.0, unit, 0.0,
    0.0, 0.0, -unit,
    -unit, 0.0, 0.0,

    0.0, 0.0, -unit,
    unit, 0.0, 0.0,
    0.0, 0.0, unit,
    -unit, 0.0, 0.0,

  ];

  let finalPositoin = [];
  facePositions.forEach((v, i) => {
    const t = (i + 1) % 3;
    if (t === 1 && offset && offset.x)
      v = v + offset.x;
    else if (t === 2 && offset && offset.y)
      v += offset.y;
    else if (t === 0 && offset && offset.z)
      v += offset.z;
    finalPositoin.push(v);
  })

  const colors4 = [
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
  ];

  // Convert the array of colors into a table for all the vertices.
  let faceColors = [];
  for (let j = 0; j < colors4.length; ++j) {
    const c = colors4[j];
    if (j === 4)
      faceColors = faceColors.concat(c, c, c, c);
    else
      faceColors = faceColors.concat(c, c, c);
  }

  const indices = [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
    9, 10, 11,
    12, 13, 14, 12, 14, 15,
  ];

  return {
    position: finalPositoin,
    color: faceColors,
    indices
  };
}


//正方形
export function createSquareVertices(size: number = 1.0, offset?: WEBGL.Vertices3): WEBGL.BufferVertices {
  const unit: number = 1.0 * size;
  const facePositions = [
    0.0, 0.0, -unit,
    unit, 0.0, 0.0,
    0.0, 0.0, unit,
    -unit, 0.0, 0.0,
  ];

  let finalPositoin = [];
  facePositions.forEach((v, i) => {
    const t = (i + 1) % 3;
    if (t === 1 && offset && offset.x)
      v = v + offset.x;
    else if (t === 2 && offset && offset.y)
      v += offset.y;
    else if (t === 0 && offset && offset.z)
      v += offset.z;
    finalPositoin.push(v);
  })


  const colors4 = [
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
  ];

  let faceColors = [];
  for (let j = 0; j < colors4.length; ++j) {
    const c = colors4[j];
    faceColors = faceColors.concat(c);
  }

  const indices = [
    0, 1, 2, 0, 2, 3,
  ];

  return {
    position: finalPositoin,
    color: faceColors,
    indices
  };

}


//正方体
export function createCubeVertices(size: number = 1.0, offset?: WEBGL.Vertices3): WEBGL.BufferVertices {
  const unit: number = 1.0 * size;
  const facePositions = [
    // Front face
    -unit, -unit, unit,
    unit, -unit, unit,
    unit, unit, unit,
    -unit, unit, unit,

    // Back face
    -unit, -unit, -unit,
    -unit, unit, -unit,
    unit, unit, -unit,
    unit, -unit, -unit,

    // Top face
    -unit, unit, -unit,
    -unit, unit, unit,
    unit, unit, unit,
    unit, unit, -unit,

    // Bottom face
    -unit, -unit, -unit,
    unit, -unit, -unit,
    unit, -unit, unit,
    -unit, -unit, unit,

    // Right face
    unit, -unit, -unit,
    unit, unit, -unit,
    unit, unit, unit,
    unit, -unit, unit,

    // Left face
    -unit, -unit, -unit,
    -unit, -unit, unit,
    -unit, unit, unit,
    -unit, unit, -unit,
  ];

  let finalPositoin = [];
  facePositions.forEach((v, i) => {
    const t = (i + 1) % 3;
    if (t === 1 && offset && offset.x)
      v = v + offset.x;
    else if (t === 2 && offset && offset.y)
      v += offset.y;
    else if (t === 0 && offset && offset.z)
      v += offset.z;
    finalPositoin.push(v);
  })


  const colors6 = [
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
    randomVerticeColor(),
  ];

  let faceColors = [];
  for (let j = 0; j < colors6.length; ++j) {
    const c = colors6[j];
    faceColors = faceColors.concat(c, c, c, c);
  }

  const indices = [
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // back
    8, 9, 10, 8, 10, 11,   // top
    12, 13, 14, 12, 14, 15,   // bottom
    16, 17, 18, 16, 18, 19,   // right
    20, 21, 22, 20, 22, 23,   // left
  ];

  const vertexNormals = [
    // Front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
  ];

  return {
    position: finalPositoin,
    color: faceColors,
    normal: vertexNormals,
    indices
  };

}

//画圆形
export function createCircleVertices(size: number = 1.0): WEBGL.BufferVertices {

  const N = 50;
  let facePositions = [0.0, 0.0, 0.0];
  let indices = [];
  const r = 0.5 * size; //半径

  for (let i = 0; i < N; i++) {
    const theta = i * (((2 * r * Math.PI) / N) / r); //求一段N 对应的弧度(长度为R是一弧度)
    let z = r * Math.sin(theta);
    let x = r * Math.cos(theta);
    facePositions.push(x, 0.0, z);
  }

  const colors1 = [
    randomVerticeColor(),
  ];

  let faceColors = [];
  for (let j = 0; j <= N; ++j) 
    faceColors = faceColors.concat(colors1[0]);

  for (let i = 0; i < N; i++) {
    indices.push(0, i + 1, i + 1 === N ? 1 : i + 2);
  }

  return {
    position: facePositions,
    color: faceColors,
    indices
  };

}

//画球体
export function createSphereVertices(size: number = 1.0): WEBGL.BufferVertices {

  const N = 30;
  let facePositions = [];
  let indices = [];
  let normals = [];
  let textureCoordData = [];
  const r = 0.5 * size; //半径

  for (let i = 0; i <= N; i++) {
    const theta = i * (Math.PI / N); //求一段N 对应的弧度(注意：这里是半圆基准, 假想维度)
    let y = r * Math.cos(theta);
    let er = r * Math.sin(theta);
    for (let j = 0; j <= N; j++) {
      const etheta = j * ((2 * Math.PI) / N); //求一段N 对应的弧度(这里是一小整圆)
      let ex = er * Math.cos(etheta);
      let ez = er * Math.sin(etheta);
      const u = 1 - (j / N);
      const v = 1 - (i / N);
      textureCoordData.push(u);
      textureCoordData.push(v);
      facePositions.push(ex, y, ez);
    }
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N ; j++) {
      const Line1 = i * (N + 1) + j; //第一行的点
      const Line2 = (i + 1) * (N + 1) + j;//第二行的点, 
      //position一行N+1个点，起始2个重合，所以indices一行需要和下一行配对N组矩形，每组2个三角形。

      indices.push(
        Line1, Line2, Line2 + 1,
        Line1, Line1 + 1, Line2 + 1,
      );
    }
  }

  const colors1 = [
    randomVerticeColor(),
  ];

  let faceColors = [];
  for (let j = 0; j < 3 * N * N; ++j){
    faceColors = faceColors.concat(colors1[0]);
    normals.push(0.0, 1.0, 0.0);
  }
  
  return {
    position: facePositions,
    //color: faceColors,
    normal: facePositions,
    texture: textureCoordData,
    indices
  };

}
