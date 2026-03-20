import { type Container } from "@dashboard/types";
import { Radio, TableCell } from "@material-ui/core";

import Checkbox from "../Checkbox";
import TableRowLink from "../TableRowLink";

interface SingleSelectionRowsProps {
  containers: Container[];
  selectedItemId: string;
  onSelect: (id: string) => void;
}

export const SingleSelectionRows = ({
  containers,
  selectedItemId,
  onSelect,
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
            <Radio
              checked={isSelected}
              onChange={() => onSelect(container.id)}
              value={container.id}
              name="container-selection"
            />
          </TableCell>
          <TableCell style={{ width: "100%" }} data-test-id={container.name}>
            {container.name}
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
}

export const MultiSelectionRows = ({
  containers,
  isSelected,
  onToggle,
}: MultiSelectionRowsProps) => (
  <>
    {containers?.map(container => (
      <TableRowLink key={container.id} data-test-id="dialog-row">
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected(container.id)} onChange={() => onToggle(container)} />
        </TableCell>
        <TableCell style={{ width: "100%" }} data-test-id={container.name}>
          {container.name}
        </TableCell>
      </TableRowLink>
    ))}
  </>
);
