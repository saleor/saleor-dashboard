// @ts-strict-ignore
import Debounce from "@dashboard/components/Debounce";
import { DashboardModal } from "@dashboard/components/Modal";
import TableRowLink from "@dashboard/components/TableRowLink";
import { OrderFulfillLineFragment, WarehouseFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { getById } from "@dashboard/misc";
import { getLineAvailableQuantityInWarehouse } from "@dashboard/orders/utils/data";
import useWarehouseSearch from "@dashboard/searches/useWarehouseSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import {
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TableCell,
  TextField,
} from "@material-ui/core";
import {
  Button,
  DialogTable,
  isScrolledToBottom,
  SearchIcon,
  useElementScroll,
} from "@saleor/macaw-ui";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { changeWarehouseDialogMessages as messages } from "./messages";
import { useStyles } from "./styles";

export interface OrderChangeWarehouseDialogProps {
  open: boolean;
  line: OrderFulfillLineFragment;
  currentWarehouseId: string;
  onConfirm: (warehouse: WarehouseFragment) => void;
  onClose: () => any;
}

export const OrderChangeWarehouseDialog: React.FC<OrderChangeWarehouseDialogProps> = ({
  open,
  line,
  currentWarehouseId,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const { anchor, position, setAnchor } = useElementScroll();
  const bottomShadow = !isScrolledToBottom(anchor, position, 20);
  const [query, setQuery] = React.useState<string>("");
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentWarehouseId) {
      setSelectedWarehouseId(currentWarehouseId);
    }
  }, [currentWarehouseId]);

  const {
    result: warehousesOpts,
    loadMore,
    search,
  } = useWarehouseSearch({
    variables: {
      after: null,
      channnelsId: null,
      first: 20,
      query: "",
    },
  });
  const filteredWarehouses = mapEdgesToItems(warehousesOpts?.data?.search);
  const selectedWarehouse = filteredWarehouses?.find(getById(selectedWarehouseId ?? ""));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWarehouseId(e.target.value);
  };
  const handleSubmit = () => {
    onConfirm(selectedWarehouse);
    onClose();
  };

  React.useEffect(() => {
    if (!bottomShadow) {
      loadMore();
    }
  }, [bottomShadow]);

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="md">
        <DashboardModal.Title>
          <Box display="flex" justifyContent="space-between">
            <FormattedMessage {...messages.dialogTitle} />
            <DashboardModal.Close onClose={onClose} />
          </Box>

          <Text size={3}>
            <FormattedMessage
              {...messages.dialogDescription}
              values={{
                productName: line?.productName,
              }}
            />
          </Text>
        </DashboardModal.Title>

        <Debounce debounceFn={search}>
          {debounceSearchChange => {
            const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value;

              setQuery(value);
              debounceSearchChange(value);
            };

            return (
              <TextField
                value={query}
                variant="outlined"
                onChange={handleSearchChange}
                placeholder={intl.formatMessage(messages.searchFieldPlaceholder)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ className: classes.searchInput }}
              />
            );
          }}
        </Debounce>

        <Text textTransform="uppercase" fontWeight="medium" lineHeight={2}>
          <FormattedMessage {...messages.warehouseListLabel} />
        </Text>

        <DialogTable ref={setAnchor}>
          {filteredWarehouses ? (
            <RadioGroup
              value={selectedWarehouseId}
              onChange={handleChange}
              className={classes.tableBody}
            >
              {filteredWarehouses.map(warehouse => {
                const lineQuantityInWarehouse = getLineAvailableQuantityInWarehouse(
                  line,
                  warehouse,
                );

                return (
                  <TableRowLink key={warehouse.id}>
                    <TableCell className={classes.tableCell}>
                      <FormControlLabel
                        value={warehouse.id}
                        control={<Radio color="primary" />}
                        label={
                          <div className={classes.radioLabelContainer}>
                            <span className={classes.warehouseName}>{warehouse.name}</span>
                            <Text>
                              <FormattedMessage
                                {...messages.productAvailability}
                                values={{
                                  productCount: lineQuantityInWarehouse,
                                }}
                              />
                            </Text>
                          </div>
                        }
                      />
                      {currentWarehouseId === warehouse?.id && (
                        <Text display="inline-block" fontSize={3}>
                          <FormattedMessage {...messages.currentSelection} />
                        </Text>
                      )}
                    </TableCell>
                  </TableRowLink>
                );
              })}
            </RadioGroup>
          ) : (
            <Skeleton />
          )}
        </DialogTable>

        <DashboardModal.Actions>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="primary"
            disabled={!selectedWarehouse}
          >
            {intl.formatMessage(buttonMessages.select)}
          </Button>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
OrderChangeWarehouseDialog.displayName = "OrderChangeWarehouseDialog";
export default OrderChangeWarehouseDialog;
