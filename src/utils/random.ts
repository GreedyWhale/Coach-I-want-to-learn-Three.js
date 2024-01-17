/*
 * @Description: 获取随机数
 * @Author: MADAO
 * @Date: 2024-01-16 14:12:23
 * @LastEditors: MADAO
 * @LastEditTime: 2024-01-17 11:32:09
 */
type Point = {x: number, y: number};


function generateRandomPoint() {
  let x;
  let y;

  // 循环直到生成的点的 x 轴坐标不在 -1 到 1 的范围内
  do {
    x = (Math.random() - 0.5) * 19;  // 在 x 轴上生成 -9.5 到 9.5 之间的随机数
    y = (Math.random() - 0.5) * 19;  // 在 y 轴上生成 -9.5 到 9.5 之间的随机数
  } while (x >= -1.25 && x <= 1.25);

  return { x, y };
}

function isInsideMiddleSquare(point: Point) {
  // 检查点是否在中间的6x6区域内
  return point.x >= -3.5 && point.x <= 3.5 && point.y >= -3.5 && point.y <= 3.5;
}

export function generatePoints(numPoints: number, minDistance: number) {
  const points: Point[] = [];

  while (points.length < numPoints) {
    const newPoint = generateRandomPoint();

    // 检查新生成的点是否在中间的6x6区域内，或者与已有的点距离是否小于指定的最小距离
    if (!isInsideMiddleSquare(newPoint) && points.every(p => Math.hypot(p.x - newPoint.x, p.y - newPoint.y) >= minDistance)) {
      points.push(newPoint);
    }
  }

  return points;
}
