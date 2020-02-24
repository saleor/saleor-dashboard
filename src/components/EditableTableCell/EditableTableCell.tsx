import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";

import useForm from "@saleor/hooks/useForm";

const useStyles = makeStyles(
  theme => ({
    card: {
      border: `1px solid ${theme.palette.divider}`
    },
    container: {
      position: "relative"
    },
    overlay: {
      cursor: "pointer",
      height: "100vh",
      left: 0,
      position: "fixed",
      top: 0,
      width: "100vw",
      zIndex: 1
    },
    root: {
      left: 0,
      minWidth: theme.spacing(20),
      position: "absolute",
      top: 0,
      width: `calc(100% + ${theme.spacing(4)}px)`,
      zIndex: 2
    },
    text: {
      cursor: "pointer",
      fontSize: "0.8125rem"
    }
  }),
  { name: "EditableTableCell" }
);

interface EditableTableCellProps {
  className?: string;
  defaultValue?: string;
  focused?: boolean;
  InputProps?: TextFieldProps;
  value: string;
  onConfirm(value: string): any;
}

export const EditableTableCell: React.FC<EditableTableCellProps> = props => {
  const {
    className,
    defaultValue,
    focused,
    InputProps,
    value,
    onConfirm
  } = props;
  const classes = useStyles(props);

  const handleConfirm = (data: { value: string }) => {
    disable();
    onConfirm(data.value);
  };

  const [opened, setOpenStatus] = React.useState(focused);
  const { change, data } = useForm({ value }, handleConfirm);
  const enable = () => setOpenStatus(true);
  const disable = () => setOpenStatus(false);

  return (
    <TableCell className={classNames(classes.container, className)}>
      {opened && <div className={classes.overlay} onClick={disable} />}
      <Typography variant="caption" onClick={enable} className={classes.text}>
        {value || defaultValue}
      </Typography>
      {opened && (
        <div className={classes.root}>
          <Card className={classes.card}>
            <CardContent>
              <TextField
                name="value"
                autoFocus
                fullWidth
                onChange={change}
                value={data.value}
                variant="standard"
                {...InputProps}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </TableCell>
  );
};
EditableTableCell.displayName = "EditableTableCell";
export default EditableTableCell;
