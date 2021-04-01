import { Shadows } from "@material-ui/core/styles/shadows";

const createShadow = (pv, pb, ps, uv, ub, us, av, ab, as) =>
  [
    `0 ${pv}px ${pb}px ${ps}px rgba(0, 0, 0, 0.2)`,
    `0 ${uv}px ${ub}px ${us}px rgba(0, 0, 0, 0.14)`,
    `0 ${av}px ${ab}px ${as}px rgba(0, 0, 0, 0.12)`
  ].join(",");

const shadows: Shadows = [
  "none",
  createShadow(1, 1, 0, 2, 1, -2, 1, 3, 0),
  createShadow(2, 2, 0, 3, 1, -2, 1, 5, 0),
  createShadow(3, 4, 0, 3, 3, -2, 1, 8, 0),
  createShadow(4, 5, 0, 1, 10, 0, 2, 4, -1),
  createShadow(5, 8, 0, 1, 14, 0, 3, 4, -1),
  createShadow(6, 10, 0, 1, 18, 0, 3, 5, -1),
  createShadow(7, 10, 0, 2, 16, 1, 4, 5, -2),
  createShadow(8, 10, 1, 3, 14, 2, 5, 5, -3),
  createShadow(9, 12, 1, 3, 16, 3, 5, 6, -4),
  createShadow(10, 14, 1, 4, 18, 3, 6, 7, -4),
  createShadow(11, 16, 1, 4, 20, 3, 6, 7, -4),
  createShadow(12, 17, 1, 5, 22, 4, 7, 8, -4),
  createShadow(13, 19, 1, 5, 24, 4, 7, 8, -4),
  createShadow(14, 21, 1, 5, 26, 4, 7, 9, -5),
  createShadow(15, 22, 1, 5, 28, 4, 7, 9, -5),
  createShadow(16, 24, 2, 6, 30, 5, 8, 10, -5),
  createShadow(15, 27, 3, 7, 28, 3, 10, 14, -4),
  createShadow(14, 30, 4, 8, 26, 1, 12, 17, -3),
  createShadow(13, 33, 4, 8, 24, -1, 14, 20, -1),
  createShadow(12, 36, 5, 9, 22, -2, 16, 24, 1),
  createShadow(11, 39, 6, 10, 20, -4, 18, 28, 1),
  createShadow(10, 41, 7, 10, 18, -5, 20, 31, 2),
  createShadow(9, 44, 7, 11, 16, -6, 22, 35, 2),
  createShadow(9, 46, 8, 11, 15, -7, 24, 38, 3)
];

export default shadows;
