/**
 * Pick the active section from scroll geometry.
 * Sections must be in document order; tops are viewport Y of each section.
 */
export const resolveActiveSectionIndex = ({
  sectionTops,
  markerY,
  nearBottom,
}: {
  sectionTops: number[];
  markerY: number;
  nearBottom: boolean;
}): number => {
  if (sectionTops.length === 0) {
    return -1;
  }

  if (nearBottom) {
    return sectionTops.length - 1;
  }

  let activeIndex = 0;

  for (let index = 0; index < sectionTops.length; index++) {
    if (sectionTops[index] <= markerY) {
      activeIndex = index;
    } else {
      break;
    }
  }

  return activeIndex;
};
