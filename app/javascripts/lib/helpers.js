export function timestamp() {
  return Date.now();
}

export function offsetPositions(objs, offset) {
  return objs.map(obj => {
    return {
      x: obj.x + offset[0],
      y: obj.y + offset[1],
    }
  });
}
