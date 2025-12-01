import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { WarehouseFragment } from "@dashboard/graphql";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { TableBody, TableCell, TableRow, TextField } from "@material-ui/core";
import { ConfirmButton } from "@saleor/macaw-ui";
import { Button, Option, sprinkles, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

interface ProductStocksAssignWarehousesProps {
  warehousesToAssign: WarehouseFragment[];
  hasMoreWarehouses: boolean;
  loadMoreWarehouses: () => void;
  onWarehouseSelect: (warehouseId: string, warehouseName: string) => void;
  loading: boolean;
  searchWarehouses: (query: string) => void;
  showAssignWarehousesButton: boolean;
}

export const ProductStocksAssignWarehouses = ({
  hasMoreWarehouses,
  loadMoreWarehouses,
  onWarehouseSelect,
  warehousesToAssign,
  loading,
  searchWarehouses,
  showAssignWarehousesButton,
}: ProductStocksAssignWarehousesProps) => {
  const [warehouses, setWarehouses] = useState<Option[]>([]);
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const [query, onQueryChange, queryReset] = useSearchQuery(searchWarehouses);

  const handleClose = () => {
    setOpen(false);
    queryReset();
    setWarehouses([]);
  };

  return (
    <>
      {showAssignWarehousesButton && (
        <Button
          onClick={() => setOpen(true)}
          disabled={loading}
          marginTop={5}
          type="button"
          variant="secondary"
          data-test-id="assign-warehouse-button"
        >
          {intl.formatMessage({
            defaultMessage: "Assign Warehouses",
            id: "mFC5Rq",
          })}
        </Button>
      )}
      <DashboardModal onChange={handleClose} open={open}>
        <DashboardModal.Content size="sm">
          <DashboardModal.Header>
            {intl.formatMessage({
              defaultMessage: "Assign Warehouses",
              id: "mFC5Rq",
            })}
          </DashboardModal.Header>

          <TextField
            name="query"
            value={query}
            onChange={onQueryChange}
            label="Search warehouses"
            placeholder="Search by warehouse name"
            fullWidth
            InputProps={{
              autoComplete: "off",
              endAdornment: loading && <SaleorThrobber size={16} />,
            }}
          />

          <InfiniteScroll
            id="assignWarehouseScrollableDialog"
            dataLength={warehousesToAssign.length}
            next={loadMoreWarehouses}
            hasMore={hasMoreWarehouses}
          >
            <ResponsiveTable key="table">
              <TableBody>
                {warehousesToAssign.length === 0 && (
                  <TableRow>
                    <TableCell align="center">
                      <Text>No warehouses available to add</Text>
                    </TableCell>
                  </TableRow>
                )}
                {warehousesToAssign.map(warehouse => {
                  const isChecked = warehouses.some(w => w.value === warehouse.id);

                  return (
                    <TableRowLink key={warehouse.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isChecked}
                          onChange={() =>
                            setWarehouses(prev => {
                              if (isChecked) {
                                return prev.filter(w => w.value !== warehouse.id);
                              }

                              return [...prev, { value: warehouse.id, label: warehouse.name }];
                            })
                          }
                        />
                      </TableCell>
                      <TableCell
                        className={sprinkles({
                          paddingLeft: 0,
                        })}
                      >
                        {warehouse.name}
                      </TableCell>
                    </TableRowLink>
                  );
                })}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
          <DashboardModal.Actions>
            <BackButton onClick={handleClose} />
            <ConfirmButton
              type="submit"
              transitionState="default"
              labels={{
                confirm: intl.formatMessage({
                  defaultMessage: "Confirm",
                  id: "N2IrpM",
                }),
                error: intl.formatMessage({
                  defaultMessage: "Error",
                  id: "KN7zKn",
                }),
              }}
              onClick={() => {
                warehouses.forEach(warehouse => {
                  onWarehouseSelect(warehouse.value, warehouse.label);
                });
                handleClose();
              }}
            />
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>
    </>
  );
};
