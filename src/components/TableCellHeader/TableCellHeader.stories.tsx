import { Card, TableBody, TableCell, TableHead } from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableRowLink from "@saleor/components/TableRowLink";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../storybook/Decorator";
import TableCellHeader, {
  TableCellHeaderArrowDirection,
} from "./TableCellHeader";

type Field = "name" | "type";
interface StoryProps {
  direction: TableCellHeaderArrowDirection;
  field?: Field;
  onHeaderClick?: (field: Field) => void;
}

const Story: React.FC<StoryProps> = ({
  direction,
  field = "name",
  onHeaderClick = () => undefined,
}) => (
  <Card style={{ margin: "auto", width: 400 }}>
    <ResponsiveTable>
      <TableHead>
        <TableRowLink>
          <TableCellHeader
            arrowPosition="right"
            direction={field === "name" ? direction : undefined}
            onClick={() => onHeaderClick("name")}
          >
            Name
          </TableCellHeader>
          <TableCellHeader
            direction={field === "type" ? direction : undefined}
            onClick={() => onHeaderClick("type")}
          >
            Type
          </TableCellHeader>
        </TableRowLink>
      </TableHead>
      <TableBody>
        <TableRowLink>
          <TableCell>Apple Juice</TableCell>
          <TableCell>Juice</TableCell>
        </TableRowLink>
      </TableBody>
    </ResponsiveTable>
  </Card>
);
const InteractiveStory: React.FC = () => {
  const [direction, setDirection] =
    React.useState<TableCellHeaderArrowDirection>("asc");
  const [field, setField] = React.useState<Field>("name");

  const handleHeaderClick = (selectedField: Field) => {
    if (field === selectedField) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setField(selectedField);
      setDirection("asc");
    }
  };

  return (
    <Story
      direction={direction}
      field={field}
      onHeaderClick={handleHeaderClick}
    />
  );
};

storiesOf("Generics / Table header", module)
  .addDecorator(Decorator)
  .add("ascending", () => <Story direction="asc" />)
  .add("descending", () => <Story direction="desc" />)
  .add("interactive", () => <InteractiveStory />);
