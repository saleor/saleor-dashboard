import Button from "@material-ui/core/Button";
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

import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetAtomicData } from "@saleor/hooks/useFormset";
import CardTitle from "@saleor/components/CardTitle";
import { getFieldError } from "@saleor/utils/errors";
import { UserError } from "@saleor/types";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { renderCollection } from "@saleor/misc";
import Link from "@saleor/components/Link";

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
  onChange: FormsetChange;
  onFormDataChange: FormChange;
  onWarehousesEdit: () => void;
}

const useStyles = makeStyles(
  theme => ({
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
  onChange,
  onFormDataChange,
  onWarehousesEdit
}) => {
  const classes = useStyles({});
  const intl = useIntl();

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
            <Button
              className={classes.editWarehouses}
              color="primary"
              data-cy="edit-warehouses"
              onClick={onWarehousesEdit}
            >
              <FormattedMessage
                defaultMessage="Edit Warehouses"
                description="button"
              />
            </Button>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            stocks,
            stock => (
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
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={2}>
                  <FormattedMessage
                    defaultMessage={
                      "This product doesn't have any stock. You can add it <l>here</l>."
                    }
                    values={{
                      l: str => <Link onClick={onWarehousesEdit}>{str}</Link>
                    }}
                  />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

ProductStocks.displayName = "ProductStocks";
export default ProductStocks;
