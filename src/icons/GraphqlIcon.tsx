import {
  getNavigationCustomIconStrokeWidth,
  navigationLucideIconProps,
} from "@dashboard/components/icons";
import { Box } from "@saleor/macaw-ui-next";

const GRAPHQL_VIEWBOX_WIDTH = 24;
/** Hex lines intersect more than typical Lucide shapes at the same nominal stroke. */
const graphqlStrokeWidth = getNavigationCustomIconStrokeWidth(GRAPHQL_VIEWBOX_WIDTH) - 0.15;
const graphqlVertexRadius = 2.25;
const graphqlIconOpacity = 0.95;

export const GraphqlIcon = (): JSX.Element => (
  <Box __opacity={graphqlIconOpacity}>
    <svg
      width={navigationLucideIconProps.size}
      height={navigationLucideIconProps.size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={graphqlStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-macaw-ui-candidate
    >
      <path d="M12 3.5L4.5 8v8l7.5 4.5L19.5 16V8L12 3.5Z" />
      <path d="M12 12l7.5-4.5M12 12v9M12 12L4.5 7.5" />
      <circle cx="12" cy="3.5" r={graphqlVertexRadius} fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="8" r={graphqlVertexRadius} fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="16" r={graphqlVertexRadius} fill="currentColor" stroke="none" />
      <circle cx="12" cy="20.5" r={graphqlVertexRadius} fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="16" r={graphqlVertexRadius} fill="currentColor" stroke="none" />
      <circle cx="19.5" cy="8" r={graphqlVertexRadius} fill="currentColor" stroke="none" />
    </svg>
  </Box>
);
