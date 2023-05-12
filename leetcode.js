const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];

let currArea = 0;

height.forEach((x, idxX) => {
  height.forEach((val, idxVal) => {
    if (idxVal > idxX) {
      const refVal = Math.min(x, val);
      console.log(refVal * (idxVal - idxX));
      currArea = Math.max(currArea, refVal * (idxVal - idxX));
    }
  });
});

console.log(currArea);

//     if (val >= x) {
//       multipliers.push([val, idx]);
//     }
//   });

//   console.log(multipliers);
//   console.log("------");

//   multipliers.forEach((m) => {
//     const refVal = Math.min(x, m[0]);
//     if (m[1] * refVal > currArea) {
//       currArea = m[1] * refVal;
//     }
//   });
