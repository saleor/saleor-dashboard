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
  Typography
} from "@material-ui/core";
import {
  ChannelData,
  ChannelPriceAndPreorderArgs
} from "@saleor/channels/utils";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import { DateTimeTimezoneField } from "@saleor/components/DateTimeTimezoneField";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import Link from "@saleor/components/Link";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { FormChange, FormErrors } from "@saleor/hooks/useForm";
import { FormsetAtomicData, FormsetChange } from "@saleor/hooks/useFormset";
import {
  Button,
  DeleteIcon,
  IconButton,
  makeStyles,
  PlusIcon
} from "@saleor/macaw-ui";
import { ICONBUTTON_SIZE } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { getFormErrors, getProductErrorMessage } from "@saleor/utils/errors";
import createNonNegativeValueChangeHandler from "@saleor/utils/handlers/nonNegativeValueChangeHandler";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductCreateData } from "../ProductCreatePage";
import { ProductUpdateSubmitData } from "../ProductUpdatePage/form";
import { ProductVariantCreateData } from "../ProductVariantCreatePage/form";
import { ProductVariantUpdateData } from "../ProductVariantPage/form";

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
  isPreorder: boolean;
  globalThreshold: string;
  globalSoldUnits: number;
  hasPreorderEndDate: boolean;
  preorderEndDateTime?: string;
}

export interface ProductStocksProps {
  productVariantChannelListings?: ChannelData[];
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
    data: Partial<ChannelPriceAndPreorderArgs>
  ) => void;
  onChange: FormsetChange;
  onChangePreorderEndDate: FormChange;
  onEndPreorderTrigger?: () => void;
  onFormDataChange: FormChange;
  onWarehouseStockAdd: (warehouseId: string) => void;
  onWarehouseStockDelete: (warehouseId: string) => void;
  onWarehouseConfigure: () => void;
}

const useStyles = makeStyles(
  theme => ({
    colAction: {
      padding: 0,
      width: `calc(${ICONBUTTON_SIZE}px + ${theme.spacing(1)})`
    },
    colName: {},
    colQuantity: {
      textAlign: "right",
      width: 150
    },
    colSoldUnits: {
      textAlign: "right",
      width: 150
    },
    colThreshold: {
      textAlign: "right",
      width: 180
    },
    editWarehouses: {
      marginRight: theme.spacing(-1)
    },
    input: {
      padding: theme.spacing(1.5),
      textAlign: "right"
    },
    menuItem: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing(2)
      }
    },
    noWarehouseInfo: {
      marginTop: theme.spacing()
    },
    paper: {
      padding: theme.spacing(2)
    },
    popper: {
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
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "repeat(2, 1fr)"
    },
    dateTimeInputs: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    preorderInfo: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      display: "block"
    },
    caption: {
      fontSize: 14
    },
    thresholdRow: {
      display: "grid",
      gridColumnGap: theme.spacing(3),
      gridTemplateColumns: "3fr 1fr",
      marginTop: theme.spacing(1)
    },
    thresholdInput: {
      maxWidth: 400
    },
    preorderItemsLeftCount: {
      fontSize: 14,
      paddingTop: theme.spacing(2),
      textAlign: "center"
    },
    preorderLimitInfo: {
      marginTop: theme.spacing(3)
    }
  }),
  {
    name: "ProductStocks"
  }
);

const ProductStocks: React.FC<ProductStocksProps> = ({
  data,
  disabled,
  hasVariants,
  errors,
  formErrors: localFormErrors,
  onChangePreorderEndDate,
  stocks,
  warehouses,
  productVariantChannelListings = [],
  onChange,
  onEndPreorderTrigger,
  onFormDataChange,
  onVariantChannelListingChange,
  onWarehouseStockAdd,
  onWarehouseStockDelete,
  onWarehouseConfigure
}) => {
  const classes = useStyles({});
  const intl = useIntl();
  const anchor = React.useRef<HTMLDivElement>();
  const [isExpanded, setExpansionState] = React.useState(false);
  const unitsLeft = parseInt(data.globalThreshold, 10) - data.globalSoldUnits;

  const warehousesToAssign =
    warehouses?.filter(
      warehouse => !stocks.some(stock => stock.id === warehouse.id)
    ) || [];
  const formErrors = getFormErrors(["sku"], errors);

  const onThresholdChange = createNonNegativeValueChangeHandler(
    onFormDataChange
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
            error={!!formErrors.sku}
            fullWidth
            helperText={getProductErrorMessage(formErrors.sku, intl)}
            label={intl.formatMessage({
              defaultMessage: "SKU (Stock Keeping Unit)"
            })}
            name="sku"
            onChange={onFormDataChange}
            value={data.sku}
          />
        </div>
        <ControlledCheckbox
          checked={data.isPreorder}
          name="isPreorder"
          onChange={
            onEndPreorderTrigger && data.isPreorder
              ? onEndPreorderTrigger
              : onFormDataChange
          }
          disabled={disabled}
          label={
            <FormattedMessage
              defaultMessage="Variant currently in preorder"
              description="product inventory, checkbox"
            />
          }
        />

        {!data.isPreorder && (
          <>
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
          </>
        )}
      </CardContent>
      <Hr />
      {!data.isPreorder && (
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

          {!warehouses?.length && (
            <Typography
              color="textSecondary"
              className={classes.noWarehouseInfo}
            >
              {hasVariants ? (
                <>
                  <FormattedMessage
                    defaultMessage="There are no warehouses set up for your store. To add stock quantity to the variant please <a>configure a warehouse</a>"
                    description="no warehouses info"
                    id="productVariantWarehouseSectionDescription"
                    values={{
                      a: chunks => (
                        <Link onClick={onWarehouseConfigure}>{chunks}</Link>
                      )
                    }}
                  />
                </>
              ) : (
                <>
                  <FormattedMessage
                    defaultMessage="There are no warehouses set up for your store. To add stock quantity to the product please <a>configure a warehouse</a>"
                    description="no warehouses info"
                    id="productWarehouseSectionDescription"
                    values={{
                      a: chunks => (
                        <Link onClick={onWarehouseConfigure}>{chunks}</Link>
                      )
                    }}
                  />
                </>
              )}
            </Typography>
          )}
        </CardContent>
      )}
      {warehouses?.length > 0 && !data.isPreorder && (
        <Table>
          <colgroup>
            <col className={classes.colName} />
            <col className={classes.colQuantity} />
            <col className={classes.colQuantity} />
          </colgroup>
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
                  defaultMessage="Allocated"
                  description="table column header, allocated product quantity"
                  id="tableColAllocated"
                />
              </TableCell>
              <TableCell className={classes.colQuantity}>
                <FormattedMessage
                  defaultMessage="Quantity"
                  description="table column header"
                  id="tableColQuantity"
                />
              </TableCell>
              <TableCell className={classes.colAction} />
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(stocks, stock => {
              const handleQuantityChange = createNonNegativeValueChangeHandler(
                event => onChange(stock.id, event.target.value)
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
                        type: "number"
                      }}
                      onChange={handleQuantityChange}
                      value={stock.value}
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
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2">
                    <FormattedMessage
                      defaultMessage="Assign Warehouse"
                      description="button"
                    />
                  </Typography>
                </TableCell>
                <TableCell className={classes.colAction}>
                  <ClickAwayListener
                    onClickAway={() => setExpansionState(false)}
                  >
                    <div ref={anchor}>
                      <IconButton
                        data-test-id="add-warehouse"
                        color="primary"
                        variant="secondary"
                        onClick={() => setExpansionState(!isExpanded)}
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
                              transformOrigin: "right top"
                            }}
                          >
                            <Paper className={classes.paper} elevation={8}>
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
      )}
      {data.isPreorder && (
        <CardContent>
          <Typography variant="caption" className={classes.caption}>
            {intl.formatMessage({
              defaultMessage:
                "Set up an end date of preorder. When end date will be reached product will be automatically taken from preorder to standard selling",
              description: "info text"
            })}
          </Typography>

          {data.hasPreorderEndDate && (
            <div className={classes.dateTimeInputs}>
              <DateTimeTimezoneField
                name={"preorderEndDateTime"}
                disabled={disabled}
                futureDatesOnly
                fullWidth={false}
                error={localFormErrors.preorderEndDateTime}
                value={data?.preorderEndDateTime}
                onChange={event =>
                  onChangePreorderEndDate({
                    target: {
                      name: "preorderEndDateTime",
                      value: event
                    }
                  })
                }
              />
            </div>
          )}
          <Button
            name="hasPreorderEndDate"
            variant="tertiary"
            disabled={disabled}
            onClick={() =>
              onFormDataChange({
                target: {
                  name: "hasPreorderEndDate",
                  value: !data.hasPreorderEndDate
                }
              })
            }
          >
            {data.hasPreorderEndDate
              ? intl.formatMessage({ defaultMessage: "CANCEL END DATE" })
              : intl.formatMessage({ defaultMessage: "SETUP END DATE" })}
          </Button>
          <Typography variant="caption" className={classes.preorderLimitInfo}>
            {intl.formatMessage({
              defaultMessage:
                "Preordered products will be available in all warehouses. You can set a threshold for sold quantity. Leaving input blank will be interpreted as no limit to sale. Sold items will be allocated at the warehouse assigned to chosen shipping zone.",
              description: "info text"
            })}
          </Typography>
          <div className={classes.thresholdRow}>
            <TextField
              inputProps={{
                min: 0
              }}
              disabled={disabled}
              fullWidth
              helperText={intl.formatMessage({
                defaultMessage:
                  "Threshold that cannot be exceeded even if per channel thresholds are still available"
              })}
              label={intl.formatMessage({
                defaultMessage: "Global threshold"
              })}
              name="globalThreshold"
              onChange={onThresholdChange}
              value={data.globalThreshold ?? ""}
              className={classes.thresholdInput}
            />
            {productVariantChannelListings?.length > 0 && (
              <Typography
                variant="caption"
                className={classes.preorderItemsLeftCount}
              >
                {data.globalThreshold
                  ? intl.formatMessage(
                      {
                        defaultMessage: "{unitsLeft} units left",
                        description: "app has been installed"
                      },
                      { unitsLeft }
                    )
                  : intl.formatMessage({
                      defaultMessage: "Unlimited",
                      id: "unlimitedUnitsLeft",
                      description: "section header"
                    })}
              </Typography>
            )}
          </div>
        </CardContent>
      )}

      {productVariantChannelListings?.length > 0 && data.isPreorder && (
        <Table>
          <colgroup>
            <col className={classes.colName} />
            <col className={classes.colSoldUnits} />
            <col className={classes.colThreshold} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell className={classes.colName}>
                <FormattedMessage
                  defaultMessage="Channels"
                  description="tabel column header"
                />
              </TableCell>
              <TableCell className={classes.colSoldUnits}>
                <FormattedMessage
                  defaultMessage="Sold units"
                  description="table column header, sold units preorder quantity"
                  id="tableColSoldUnits"
                />
              </TableCell>
              <TableCell className={classes.colThreshold}>
                <FormattedMessage
                  defaultMessage="Channel threshold"
                  description="table column header"
                  id="tableColChannelThreshold"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(productVariantChannelListings, listing => {
              if (!listing) {
                return;
              }

              return (
                <TableRow key={listing.id}>
                  <TableCell className={classes.colName}>
                    {listing.name}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {listing?.unitsSold || 0}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    <TextField
                      name="channel-threshold"
                      disabled={disabled}
                      fullWidth
                      inputProps={{
                        className: classes.input,
                        min: 0,
                        type: "number"
                      }}
                      placeholder={intl.formatMessage({
                        defaultMessage: "Unlimited"
                      })}
                      onChange={e => {
                        onVariantChannelListingChange(listing.id, {
                          costPrice: listing.costPrice,
                          price: listing.price,
                          preorderThreshold:
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                        });
                      }}
                      value={listing?.preorderThreshold ?? ""}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

ProductStocks.displayName = "ProductStocks";
export default ProductStocks;
