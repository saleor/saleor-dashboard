import useForm from "@dashboard/hooks/useForm";
import { TableCell, TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";

import { DashboardCard } from "../Card";

const useStyles = makeStyles(
  theme => ({
    container: {
      position: "relative",
    },
    overlay: {
      cursor: "pointer",
      height: "100vh",
      left: 0,
      position: "fixed",
      top: 0,
      width: "100vw",
      zIndex: 1,
    },
    root: {
      left: 0,
      minWidth: theme.spacing(20),
      position: "absolute",
      top: 0,
      width: `calc(100% + ${theme.spacing(4)}px)`,
      zIndex: 2,
    },
    text: {
      cursor: "pointer",
      fontSize: "0.8125rem",
    },
  }),
  { name: "EditableTableCell" },
);

interface EditableTableCellProps {
  className?: string;
  defaultValue?: string;
  focused?: boolean;
  InputProps?: TextFieldProps;
  value: string;
  onConfirm: (value: string) => any;
}

export const EditableTableCell = (props: EditableTableCellProps) => {
  const {
    className,
    defaultValue,
    focused,
    InputProps,
    value,
    // onConfirm
  } = props;
  const classes = useStyles(props);

  // const handleConfirm = (data: { value: string }) => {
  //   disable();
  //   onConfirm(data.value);
  // };

  const [opened, setOpenStatus] = React.useState(focused);
  const { change, data } = useForm({ value } /* commenting out temporarily handleConfirm */);
  const enable = () => setOpenStatus(true);
  const disable = () => setOpenStatus(false);

  return (
    <TableCell className={clsx(classes.container, className)}>
      {opened && <div className={classes.overlay} onClick={disable} />}
      <Text size={2} fontWeight="light" onClick={enable} className={classes.text}>
        {value || defaultValue}
      </Text>
      {opened && (
        <div className={classes.root}>
          <DashboardCard borderColor="default1" borderWidth={1} borderStyle="solid">
            <DashboardCard.Content>
              <TextField
                name="value"
                autoFocus
                fullWidth
                onChange={change}
                value={data.value}
                variant="standard"
                {...InputProps}
              />
            </DashboardCard.Content>
          </DashboardCard>
        </div>
      )}
    </TableCell>
  );
};
EditableTableCell.displayName = "EditableTableCell";
export default EditableTableCell;
