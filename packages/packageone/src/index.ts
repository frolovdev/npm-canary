function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return String(Math.floor(Math.random() * (max - min)) + min); //The maximum is exclusive and the minimum is inclusive
}

const funcMult = (a: number, b: number) => {
  const sum = a * b;
  console.log(getRandomInt(0, 1000));
  console.log("Sum is", sum);
  return sum;
};

export { funcMult };
