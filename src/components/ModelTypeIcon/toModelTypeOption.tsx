import { iconSize } from "@dashboard/components/icons";
import { type Option } from "@saleor/macaw-ui-next";

import { getModelTypeIcon } from "./getModelTypeIcon";
import { ModelTypeIcon } from "./ModelTypeIcon";

interface ModelTypeNode {
  id: string;
  name: string;
  metadata?: Array<{ key: string; value: string }> | null;
}

/** Combobox option for a model type, carrying its icon in the option's own adornment slot. */
export const toModelTypeOption = (node: ModelTypeNode): Option => ({
  label: node.name,
  value: node.id,
  startAdornment: <ModelTypeIcon icon={getModelTypeIcon(node.metadata)} size={iconSize.small} />,
});
