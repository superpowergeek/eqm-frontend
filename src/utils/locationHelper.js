export const getLocationFromOrder = (order) => {
  const baseLeft = { x: 0, y: 0 };
  const baseRight = { x: 1, y: 0 };
  const idOdd = order % 2 === 0; // identify its side
  const count = parseInt((order / 2).toFixed(0), 10);
  if (idOdd) {
    return {
      ...baseLeft,
      y: baseLeft.y + count,
    }
  } else {
    return {
      ...baseRight,
      y: baseRight.y + count,
    }
  }
}