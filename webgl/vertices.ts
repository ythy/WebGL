export interface bufferVertices{
  position: number[];
  color: number[];
  indices?: number[];
}

interface Vertices3{
  x?:number;
  y?: number;
  z?: number;
}

//金字塔形锥体
export function createTrianglePyramidVertices(size: number = 1.0, offset?: Vertices3): bufferVertices { 
  const unit:number = 1.0 * size;
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
  facePositions.forEach((v, i)=>{
    const t = ( i + 1 ) % 3;
    if (t === 1 && offset && offset.x)
      v = v + offset.x;
    else if (t === 2 && offset && offset.y)
      v += offset.y;
    else if (t === 0 && offset && offset.z)
      v += offset.z;
    finalPositoin.push(v);
  })


  const colors4 = [
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [1.0, 1.0, 0.0, 1.0],
    [1.0, 0.0, 1.0, 1.0],
  ];

  // Convert the array of colors into a table for all the vertices.
  var faceColors = [];
  for (var j = 0; j < colors4.length; ++j) {
    const c = colors4[j];
    faceColors = faceColors.concat(c, c, colors4[2]);
  }

  return {
    position: finalPositoin,
    color: faceColors,
  };
}

  //正方形
export function createSquareVertices(size: number = 1.0, offset?: Vertices3): bufferVertices {
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
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      [1.0, 1.0, 0.0, 1.0],
      [1.0, 0.0, 1.0, 1.0],
    ];

    var faceColors = [];
    for (var j = 0; j < colors4.length; ++j) {
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