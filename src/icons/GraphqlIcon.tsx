import { navigationLucideIconProps } from "@dashboard/components/icons";
import { Box } from "@saleor/macaw-ui-next";

const graphqlVertexRadius = 2.25;
const graphqlIconOffsetX = 1;
const graphqlIconOffsetY = 2;

export const GraphqlIcon = (): JSX.Element => (
  <Box __transform={`translate(${graphqlIconOffsetX}px, ${graphqlIconOffsetY}px)`}>
    <svg
      width={navigationLucideIconProps.size}
      height={navigationLucideIconProps.size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="2 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={navigationLucideIconProps.strokeWidth}
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
