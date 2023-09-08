import { MetadataItemFragment } from "@dashboard/graphql";
import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  GridCellKind,
  ProvideEditorCallback,
} from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

interface MetadataCellProps {
  readonly kind: "metadata-cell";
  readonly data: {
    metadata: MetadataItemFragment[];
    privateMetadata: MetadataItemFragment[];
  };
}

export type MetadataCell = CustomCell<MetadataCellProps>;

const MetadataCellEdit: ReturnType<ProvideEditorCallback<MetadataCell>> = ({
  value: { data },
}) => {
  return <Box __width={400}>Editor</Box>;
};

export const metadataCellRenderer = (): CustomRenderer<MetadataCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is MetadataCell => (c.data as any).kind === "metadata-cell",
  draw: args => {
    drawTextCell(args, "show metadata");
  },
  provideEditor: () => ({
    editor: MetadataCellEdit,
    disablePadding: true,
  }),
});
