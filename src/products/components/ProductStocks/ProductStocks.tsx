import {
  Card,
  CardContent,
  ClickAwayListener,
  Grow,
  MenuItem,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { ChannelPriceArgs } from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { ProductErrorFragment, WarehouseFragment } from "@saleor/graphql";
import { FormChange, FormErrors } from "@saleor/hooks/useForm";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import { DeleteIcon, IconButton, PlusIcon } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import createNonNegativeValueChangeHandler from "@saleor/utils/handlers/nonNegativeValueChangeHandler";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductCreateData } from "../ProductCreatePage";
import { ProductUpdateSubmitData } from "../ProductUpdatePage/form";
import { ProductVariantCreateData } from "../ProductVariantCreatePage/form";
import { ProductVariantUpdateData } from "../ProductVariantPage/form";
import { messages } from "./messages";
import { useStyles } from "./styles";

export interface ProductStockFormsetData {
  quantityAllocated: number;
}
export type ProductStockInput = FormsetAtomicData<
  ProductStockFormsetData,
  string
>;
export interface ProductStockFormData {
  sku: string;
  trackInventory: boolean;
}

export interface ProductStocksProps {
  data: ProductStockFormData;
  disabled: boolean;
  errors: ProductErrorFragment[];
  formErrors:
    | FormErrors<ProductVariantCreateData>
    | FormErrors<ProductVariantUpdateData>
    | FormErrors<ProductUpdateSubmitData>
    | FormErrors<ProductCreateData>;
  hasVariants: boolean;
  stocks: ProductStockInput[];
  warehouses: WarehouseFragment[];
  onVariantChannelListingChange?: (
    id: string,
    data: Partial<ChannelPriceArgs>,
  ) => void;
  onChange: FormsetChange;
  onFormDataChange: FormChange;
  onWarehouseStockAdd: (warehouseId: string) => void;
  onWarehouseStockDelete: (warehouseId: string) => void;
  onWarehouseConfigure: () => void;
}

const ProductStocks: React.FC<ProductStocksProps> = ({
  data,
  disabled,
  errors,
  stocks,
  warehouses,
  onChange,
  onFormDataChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const anchor = React.useRef<HTMLDivElement>();
  const [lastStockRowFocus, setLastStockRowFocus] = React.useState(false);
  const [isExpanded, setExpansionState] = React.useState(false);

  const warehousesToAssign =
    warehouses?.filter(
      warehouse => !stocks.some(stock => stock.id === warehouse.id),
    ) || [];
  const formErrors = getFormErrors(["sku"], errors);

  const handleWarehouseStockAdd = (warehouseId: string) => {
    onWarehouseStockAdd(warehouseId);
    setLastStockRowFocus(true);
  };

  const handleStockInputFocus = (input: HTMLDivElement) => {
    if (lastStockRowFocus && input) {
      input.focus();
      setLastStockRowFocus(false);
    }
  };

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <div className={classes.skuInputContainer}>
          <TextField
            disabled={disabled}
            error={!!formErrors.sku}
            fullWidth
            helperText={getProductErrorMessage(formErrors.sku, intl)}
            label={intl.formatMessage(messages.sku)}
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
              <FormattedMessage {...messages.trackInventory} />
              <Typography variant="caption">
                <FormattedMessage {...messages.trackInventoryDescription} />
              </Typography>
            </>
          }
        />
      </CardContent>
      <Hr />
      {warehouses?.length > 0 && (
        <Table>
          <colgroup>
            <col className={classes.colName} />
            <col className={classes.colQuantity} />
            <col className={classes.colQuantity} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell className={classes.colName}>
                <FormattedMessage {...messages.warehouseName} />
              </TableCell>
              <TableCell className={classes.colQuantity}>
                <FormattedMessage {...messages.allocated} />
              </TableCell>
              <TableCell className={classes.colQuantity}>
                <FormattedMessage {...messages.quantity} />
              </TableCell>
              <TableCell className={classes.colAction} />
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(stocks, (stock, index) => {
              const handleQuantityChange = createNonNegativeValueChangeHandler(
                event => onChange(stock.id, event.target.value),
              );

              return (
                <TableRow key={stock.id}>
                  <TableCell className={classes.colName}>
                    {stock.label}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {stock.data?.quantityAllocated || 0}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    <TextField
                      data-test-id="stock-input"
                      disabled={disabled}
                      fullWidth
                      inputProps={{
                        className: classes.input,
                        min: 0,
                        type: "number",
                      }}
                      onChange={handleQuantityChange}
                      value={stock.value}
                      inputRef={input =>
                        stocks.length === index + 1 &&
                        handleStockInputFocus(input)
                      }
                    />
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <IconButton
                      variant="secondary"
                      color="primary"
                      onClick={() => onWarehouseStockDelete(stock.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
            {warehousesToAssign.length > 0 && (
              <ClickAwayListener onClickAway={() => setExpansionState(false)}>
                <TableRow
                  className={classes.addRow}
                  onClick={() => setExpansionState(!isExpanded)}
                >
                  <TableCell colSpan={3} className={classes.actionableText}>
                    <Typography variant="body2">
                      <FormattedMessage {...messages.assignWarehouse} />
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <div ref={anchor}>
                      <IconButton
                        data-test-id="add-warehouse"
                        color="primary"
                        variant="secondary"
                        className={classes.actionableText}
                      >
                        <PlusIcon />
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
                              transformOrigin: "right top",
                            }}
                          >
                            <Paper className={classes.paper} elevation={8}>
                              {warehousesToAssign.map(warehouse => (
                                <MenuItem
                                  className={classes.menuItem}
                                  onClick={() =>
                                    handleWarehouseStockAdd(warehouse.id)
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
                  </TableCell>
                </TableRow>
              </ClickAwayListener>
            )}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

ProductStocks.displayName = "ProductStocks";
export default ProductStocks;
