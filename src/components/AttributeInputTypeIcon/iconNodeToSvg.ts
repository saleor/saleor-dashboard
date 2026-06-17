/**
 * Canvas / Datagrid only. Builds SVG markup strings for glide-data-grid custom cells.
 * React UI should use AttributeInputTypeIcon instead.
 */
type IconNodeElement = readonly [string, Record<string, string>];
export type IconNode = readonly IconNodeElement[];

export const escapeSvgAttribute = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const iconNodeToSvg = (
  iconNode: IconNode,
  size: number,
  strokeWidth: number,
  color: string,
): string => {
  const children = iconNode
    .map(([tag, attributes]) => {
      const attributeString = Object.entries(attributes)
        .map(([key, value]) => `${key}="${escapeSvgAttribute(value)}"`)
        .join(" ");

      return `<${tag} ${attributeString}/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${escapeSvgAttribute(color)}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${children}</svg>`;
};
