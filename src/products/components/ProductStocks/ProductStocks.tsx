import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import { fade } from "@material-ui/core/styles/colorManipulator";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetAtomicData } from "@saleor/hooks/useFormset";
import CardTitle from "@saleor/components/CardTitle";
import { getFieldError } from "@saleor/utils/errors";
import { UserError } from "@saleor/types";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { renderCollection } from "@saleor/misc";
import { ICONBUTTON_SIZE } from "@saleor/theme";
import { WarehouseFragment } from "@saleor/warehouses/types/WarehouseFragment";

export type ProductStockInput = FormsetAtomicData<null, string>;
export interface ProductStockFormData {
  sku: string;
  trackInventory: boolean;
}

export interface ProductStocksProps {
  data: ProductStockFormData;
  disabled: boolean;
  errors: UserError[];
  stocks: ProductStockInput[];
  warehouses: WarehouseFragment[];
  onChange: FormsetChange;
  onFormDataChange: FormChange;
  onWarehouseStockAdd: (warehouseId: string) => void;
  onWarehouseStockDelete: (warehouseId: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    colAction: {
      padding: 0,
      width: ICONBUTTON_SIZE + theme.spacing()
    },
    colName: {},
    colQuantity: {
      textAlign: "right",
      width: 200
    },
    editWarehouses: {
      marginRight: -theme.spacing()
    },
    input: {
      padding: theme.spacing(1.5),
      textAlign: "right"
    },
    inputComponent: {
      width: 100
    },
    menuItem: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing(2)
      }
    },
    paper: {
      padding: theme.spacing(2)
    },
    popper: {
      boxShadow: `0px 5px 10px 0 ${fade(theme.palette.common.black, 0.05)}`,
      marginTop: theme.spacing(1),
      zIndex: 2
    },
    quantityContainer: {
      paddingTop: theme.spacing()
    },
    quantityHeader: {
      alignItems: "center",
      display: "flex",
      justifyContent: "space-between"
    },
    skuInputContainer: {
      display: "grid",
      gridColumnGap: theme.spacing(3) + "px",
      gridTemplateColumns: "repeat(2, 1fr)"
    }
  }),
  {
    name: "ProductStocks"
  }
);

const ProductStocks: React.FC<ProductStocksProps> = ({
  data,
  disabled,
  errors,
  stocks,
  warehouses,
  onChange,
  onFormDataChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const anchor = React.useRef<HTMLDivElement>();
  const [isExpanded, setExpansionState] = React.useState(false);

  const warehousesToAssign = warehouses.filter(
    warehouse => !stocks.some(stock => stock.id === warehouse.id)
  );

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Inventory",
          description: "product stock, section header",
          id: "productStockHeader"
        })}
      />
      <CardContent>
        <div className={classes.skuInputContainer}>
          <TextField
            disabled={disabled}
            error={!!getFieldError(errors, "sku")}
            fullWidth
            helperText={getFieldError(errors, "sku")?.message}
            label={intl.formatMessage({
              defaultMessage: "SKU (Stock Keeping Unit)"
            })}
            name="sku"
            onChange={onFormDataChange}
            value={data.sku}
          />
        </div>
        <FormSpacer />
        <ControlledCheckbox
          checked={data.trackInventory}
          name="trackInventory"
          onChange={onFormDataChange}
          disabled={disabled}
          label={
            <>
              <FormattedMessage
                defaultMessage="Track Inventory"
                description="product inventory, checkbox"
              />
              <Typography variant="caption">
                <FormattedMessage defaultMessage="Active inventory tracking will automatically calculate changes of stock" />
              </Typography>
            </>
          }
        />
      </CardContent>
      <Hr />
      <CardContent className={classes.quantityContainer}>
        <Typography>
          <div className={classes.quantityHeader}>
            <span>
              <FormattedMessage
                defaultMessage="Quantity"
                description="header"
              />
            </span>
          </div>
        </Typography>
      </CardContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.colName}>
              <FormattedMessage
                defaultMessage="Warehouse Name"
                description="tabel column header"
              />
            </TableCell>
            <TableCell className={classes.colQuantity}>
              <FormattedMessage
                defaultMessage="Quantity Available"
                description="tabel column header"
              />
            </TableCell>
            <TableCell className={classes.colAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(stocks, stock => (
            <TableRow key={stock.id}>
              <TableCell className={classes.colName}>{stock.label}</TableCell>
              <TableCell className={classes.colQuantity}>
                <TextField
                  className={classes.inputComponent}
                  disabled={disabled}
                  fullWidth
                  inputProps={{
                    className: classes.input,
                    min: 0,
                    type: "number"
                  }}
                  onChange={event => onChange(stock.id, event.target.value)}
                  value={stock.value}
                />
              </TableCell>
              <TableCell className={classes.colAction}>
                <IconButton
                  color="primary"
                  onClick={() => onWarehouseStockDelete(stock.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {warehousesToAssign.length > 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <Typography variant="body2">
                  <FormattedMessage
                    defaultMessage="Assign Warehouse"
                    description="button"
                  />
                </Typography>
              </TableCell>
              <TableCell className={classes.colAction}>
                <ClickAwayListener onClickAway={() => setExpansionState(false)}>
                  <div ref={anchor}>
                    <IconButton
                      color="primary"
                      onClick={() => setExpansionState(!isExpanded)}
                    >
                      <AddIcon />
                    </IconButton>
                    <Popper
                      className={classes.popper}
                      open={isExpanded}
                      anchorEl={anchor.current}
                      transition
                      placement="top-end"
                    >
                      {({ TransitionProps }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin: "right top"
                          }}
                        >
                          <Paper className={classes.paper}>
                            {warehousesToAssign.map(warehouse => (
                              <MenuItem
                                className={classes.menuItem}
                                onClick={() =>
                                  onWarehouseStockAdd(warehouse.id)
                                }
                              >
                                {warehouse.name}
                              </MenuItem>
                            ))}
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </div>
                </ClickAwayListener>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

ProductStocks.displayName = "ProductStocks";
export default ProductStocks;
