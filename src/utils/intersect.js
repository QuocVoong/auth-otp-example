const intersect = (arr1, arr2) => {
  const setOne = new Set(arr1);
  const setTwo = new Set(arr2);
  const intersection = new Set([...setOne].filter(x => setTwo.has(x)));
  return Array.from(intersection);
}

module.exports = {
  intersect
}