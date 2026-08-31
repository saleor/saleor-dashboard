import { type Row } from "./types";

export const getConstraintReasonLabels = (item: Row, rows: Array<Row | string>): string[] => {
  const slugs = item.constraint?.dependsOn;

  if (!slugs?.length) {
    return [];
  }

  return slugs.flatMap(slug => {
    const match = rows.find(row => typeof row !== "string" && row.value?.value === slug);

    if (!match || typeof match === "string" || !match.value?.label) {
      return [];
    }

    return [match.value.label];
  });
};
