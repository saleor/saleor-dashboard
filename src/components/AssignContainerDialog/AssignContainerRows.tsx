import { Radio } from "@dashboard/components/Radio/Radio";
import { TableCell } from "@dashboard/components/Table/Table";
import { type Container } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import Checkbox from "../Checkbox/Checkbox";
import TableRowLink from "../TableRowLink/TableRowLink";

const ContainerLabel = ({ adornment, name }: { adornment?: ReactNode; name: string }) =>
  adornment ? (
    <Box display="flex" alignItems="center" gap={2}>
      {adornment}
      {name}
    </Box>
  ) : (
    <>{name}</>
  );

interface SingleSelectionRowsProps {
  containers: Container[];
  selectedItemId: string;
  onSelect: (id: string) => void;
  renderAdornment?: (container: Container) => ReactNode;
}

export const SingleSelectionRows = ({
  containers,
  selectedItemId,
  onSelect,
  renderAdornment,
}: SingleSelectionRowsProps) => (
  <>
    {containers?.map(container => {
      const isSelected = selectedItemId === container.id;

      return (
        <TableRowLink
          key={container.id}
          data-test-id="dialog-row"
          onClick={() => onSelect(container.id)}
        >
          <TableCell padding="checkbox">
            <Radio checked={isSelected} value={container.id} />
          </TableCell>
          <TableCell style={{ width: "100%" }} data-test-id={container.name}>
            <ContainerLabel adornment={renderAdornment?.(container)} name={container.name} />
          </TableCell>
        </TableRowLink>
      );
    })}
  </>
);

interface MultiSelectionRowsProps {
  containers: Container[];
  isSelected: (id: string) => boolean;
  onToggle: (item: Container) => void;
  renderAdornment?: (container: Container) => ReactNode;
}

export const MultiSelectionRows = ({
  containers,
  isSelected,
  onToggle,
  renderAdornment,
}: MultiSelectionRowsProps) => (
  <>
    {containers?.map(container => (
      <TableRowLink key={container.id} data-test-id="dialog-row">
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected(container.id)} onChange={() => onToggle(container)} />
        </TableCell>
        <TableCell style={{ width: "100%" }} data-test-id={container.name}>
          <ContainerLabel adornment={renderAdornment?.(container)} name={container.name} />
        </TableCell>
      </TableRowLink>
    ))}
  </>
);
