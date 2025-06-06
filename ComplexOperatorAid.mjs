export const _I = {x:-1,y:0};
export const I = {x:1,y:0};
export const II = {x:2,y:0};
export const III = {x:3,y:0};
export const I_3 = {x:1/3,y:0};
export const O = {x:0,y:0};
export const a = { x: -0.5, y: Math.sqrt(3)/2 };
export const a2 = complexMultiplication(a, a);
export const a_3 = complexMultiplication(I_3, a);
export const a2_3 = complexMultiplication(I_3, a2);
export const _a = { x: 0.5, y: -Math.sqrt(3)/2 };
export const _a2 = complexMultiplication(_I, a2);
export const a_a2 = complexAdd(a,_a2);
export const a2_a = complexAdd(a2,_a);
export const a_I = complexAdd(a,_I);
export const I_a2 = complexAdd(I,_a2);
export const I_a = complexAdd(I,_a);
export const a2_I = complexAdd(a2,_I);
export const d0 = complexAdd(I,_a2);
export const d1 = complexAdd(a,_I);
export const d2 = complexAdd(a2,_a);
export const _d0 = complexAdd(_I,a2);
export const _d1 = complexAdd(_a,I);
export const _d2 = complexAdd(_a2,a);

export function objectToArrayFormatted(obj) {
  return [obj.x, obj.y];
}

export function complexMultiplication(a, b) {
  a = allToObj([a,b])[0];
  b = allToObj([a,b])[1];
  const real = a.x * b.x - a.y * b.y;
  const imaginary = a.x * b.y + a.y * b.x;
  return { x: real, y: imaginary };
}

export function complexAdd(a, b) {
  a = allToObj([a,b])[0];
  b = allToObj([a,b])[1];
  const real = a.x + b.x;
  const imaginary = a.y + b.y;
  return { x: real, y: imaginary };
}

export function makeArray(variable) {
  if (typeof variable === 'object' && variable !== null && !Array.isArray(variable)) {
    return objectToArrayFormatted(variable);
  } else {
    return variable;
  }
}

export function allToArray(a) {
  a.forEach((element, index, arr) => {
    arr[index] = makeArray(element);
  });
  return a;
}

function arrayToObjectFormatted(array) {
  return { x: array[0], y: array[1] };
}

export function makeObj(variable) {
  if (Array.isArray(variable)) {
      return arrayToObjectFormatted(variable);
  } else if (typeof variable === 'object' && variable !== null) {
      return variable;
  } else {
      return typeof variable;
  }
}

export function allToObj(a) {
  a.forEach((element, index, arr) => {
    arr[index] = makeObj(element);
  });
  return a;
}

export function createObjectFromVector(vector) {
  let [x, y] = vector;
  return { x, y };
}

export function setVectors(p,mag){
 return [
  [p.x + mag, p.y],
  [p.x - mag / 2, p.y - (mag * Math.sqrt(3) / 2)],
  [p.x - mag / 2, p.y + (mag * Math.sqrt(3) / 2)],
  [p.x, p.y]
 ];
}

export function convertToPolar(a, isPolar) {
  if (isPolar) {
      var r = Math.sqrt(a.x*a.x + a.y*a.y);
      var θ = Math.atan2(a.y, a.x);
      // console.log("a.y",a.y,"a.x",a.x);
      return {
          magnitude: r,
          angle: (θ * 180) / Math.PI
      };
  } else {
      return {
          x: a.x,
          y: a.y
      };
  }
}

export function convertToCartesian(r, θ, isCartesian) {
  if (isCartesian) {
      var a = r * Math.cos(θ/180);
      var b = r * Math.sin(θ/180);console.log(θ/180,"b",b);
      return {
          x: a,
          y: b
      };
  } else {
      return {
          magnitude: r,
          angle: θ
      };
  }
}


// Complex division function
export function complexDivision(a, b) {
a = allToObj([a,b])[0]
b = allToObj([a,b])[1]
  const denominator = b.x * b.x + b.y * b.y;
  
  if (denominator === 0) {
      return { x: NaN, y: NaN };
  }
  
  const real = (a.x * b.x + a.y * b.y) / denominator;
  const imaginary = (a.y * b.x - a.x * b.y) / denominator;

  return { x: real, y: imaginary };
}

// Complex inverse function
export function complexInverse(b) {
b = allToObj([b])[0]
  const denominator = b.x * b.x + b.y * b.y;
  
  if (denominator === 0) {
      return { x: NaN, y: NaN };
  }
  
  const real = (b.x ) / denominator;
  const imaginary = (- b.y) / denominator;

  return { x: real, y: imaginary };
}
export function complexAbs(b) {
b = allToObj([b])[0]
  const nominator = b.x * b.x + b.y * b.y;

  return Math.sqrt(nominator);
}

// Complex multiplication3 function
export function complexMultiplication3(a, b,c) {
a = allToObj([a,b,c])[0]
b = allToObj([a,b,c])[1]
c = allToObj([a,b,c])[2]
    const real_aux = a.x * b.x - a.y * b.y;
    const imaginary_aux = a.y * b.x + a.x * b.y;
    const real = real_aux * c.x - imaginary_aux * c.y;
    const imaginary = imaginary_aux * c.x + real_aux * c.y;

    return { x: real, y: imaginary };
}


// Complex substract function
export function complexSub(a, b) {
  a = allToObj([a,b])[0]
  b = allToObj([a,b])[1]
  const real = a.x - b.x;
  const imaginary = a.y - b.y;

  return { x: real, y: imaginary };
}

export function complexAdd3(a, b, c) {
  a = allToObj([a,b,c])[0]
  b = allToObj([a,b,c])[1]
  c = allToObj([a,b,c])[2]
  const real = a.x + b.x + c.x;
  const imaginary = a.y + b.y + c.y;
  
  return { x: real, y: imaginary };
}

export function complexAdd4(a, b, c, d) {
  a = allToObj([a,b,c,d])[0]
  b = allToObj([a,b,c,d])[1]
  c = allToObj([a,b,c,d])[2]
  d = allToObj([a,b,c,d])[3]
  const real = a.x + b.x + c.x + d.x;
  const imaginary = a.y + b.y + c.y + d.y;

  return { x: real, y: imaginary };
}

export function multiplyMatrices(matrix1, matrix2) {
  if (matrix1[0].length !== matrix2.length) {
      // The number of columns in the first matrix should be equal to the number of rows in the second matrix
      throw new Error("Invalid matrix sizes for multiplication");
  }

  let result = Array.from({ length: matrix1.length }, () => new Array(matrix2[0].length).fill(null));

  for (let i = 0; i < matrix1.length; i++) {
      for (let j = 0; j < matrix2[0].length; j++) {
          let sum = { x: 0, y: 0 };
          for (let k = 0; k < matrix2.length; k++) {
              let product = complexMultiplication(matrix1[i][k], matrix2[k][j]);
              sum.x += product.x;
              sum.y += product.y;
          }
          result[i][j] = sum;
      }
  }

  return result;
}

export const matrix_abcTo123 = [
                                [I_3,I_3,I_3 ],
                                [ I_3,a_3,a2_3 ],
                                [ I_3,a2_3,a_3 ]
                                ];

                                
export function inverseMatrix(matrix) {
    var det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) -
              matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[2][0] * matrix[1][2]) +
              matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[2][0] * matrix[1][1]);
    var invDet = 1 / det;
  
    var result = [];
    result[0] = [
      (matrix[1][1] * matrix[2][2] - matrix[2][1] * matrix[1][2]) * invDet,
      (matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2]) * invDet,
      (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invDet
    ];
    result[1] = [
      (matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2]) * invDet,
      (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invDet,
      (matrix[1][0] * matrix[0][2] - matrix[0][0] * matrix[1][2]) * invDet
    ];
    result[2] = [
      (matrix[1][0] * matrix[2][1] - matrix[2][0] * matrix[1][1]) * invDet,
      (matrix[2][0] * matrix[0][1] - matrix[0][0] * matrix[2][1]) * invDet,
      (matrix[0][0] * matrix[1][1] - matrix[1][0] * matrix[0][1]) * invDet
    ];
  
    return result;
  }
  
export function PI_to_Y (Z_S,Z_E,Z_U){
  Zl = complexDivision(complexMultiplication(Z_U,Z_S),complexAdd3(Z_S,Z_E,Z_U));
  Zj = complexDivision(complexMultiplication(Z_S,Z_E),complexAdd3(Z_S,Z_E,Z_U));
  Zk = complexDivision(complexMultiplication(Z_E,Z_U),complexAdd3(Z_S,Z_E,Z_U));
  return {Zl,Zj,Zk}
}

export function Seq_012(v) {
let z = {
  Z0 : {x : complexDivision(complexAdd3(v.ZA, v.ZB, v.ZC),III).x , y : complexDivision(complexAdd3(v.ZA, v.ZB, v.ZC),III).y},  
  Z1 : {x : complexDivision(complexAdd3(v.ZA,complexMultiplication(v.ZB, a),complexMultiplication(v.ZC, a2)),III).x , y : complexDivision(complexAdd3(v.ZA,complexMultiplication(v.ZB, a),complexMultiplication(v.ZC, a2)),III).y},
  Z2 : {x : complexDivision(complexAdd3(v.ZA,complexMultiplication(v.ZB, a2),complexMultiplication(v.ZC, a)),III).x , y : complexDivision(complexAdd3(v.ZA,complexMultiplication(v.ZB, a2),complexMultiplication(v.ZC, a)),III).y}
}
  return z

    }



