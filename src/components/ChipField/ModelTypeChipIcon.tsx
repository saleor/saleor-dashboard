import { type ModelTypeIcon as ModelTypeIconValue } from "@dashboard/components/ModelTypeIcon/constants";
import { ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/ModelTypeIcon";

interface ModelTypeChipIconProps {
  /** Only model references carry one; chips for other entity types render without an icon. */
  icon?: ModelTypeIconValue;
}

export const ModelTypeChipIcon = ({ icon }: ModelTypeChipIconProps) =>
  icon ? <ModelTypeIcon icon={icon} size={14} /> : null;
