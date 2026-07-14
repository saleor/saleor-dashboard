export const TREE_INDENT_DEPTH_MULTIPLIER = 4;

export const formatIndentedTreeLabel = (label: string, depth: number): string =>
  `${"\u00A0".repeat(depth * TREE_INDENT_DEPTH_MULTIPLIER)}${label}`;
