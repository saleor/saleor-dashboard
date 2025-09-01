import ActionDialog from "@dashboard/components/ActionDialog";
import { Multiselect } from "@dashboard/components/Combobox";
import { WarehouseFragment } from "@dashboard/graphql";
import { Box, Button, Option } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface ProductStocksAssignWarehousesProps {
  warehousesToAssign: WarehouseFragment[];
  hasMoreWarehouses: boolean;
  loadMoreWarehouses: () => void;
  onWarehouseSelect: (warehouseId: string, warehouseName: string) => void;
  loading: boolean;
  searchWarehouses: (query: string) => void;
  visible: boolean;
  disabled?: boolean;
}

export const ProductStocksAssignWarehouses = ({
  hasMoreWarehouses,
  loadMoreWarehouses,
  onWarehouseSelect,
  warehousesToAssign,
  loading,
  searchWarehouses,
  visible,
  disabled = false,
}: ProductStocksAssignWarehousesProps) => {
  const [warehouses, setWarehouses] = React.useState<Option[]>([]);
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);

  return (
    <Box>
      {visible && (
        <Button
          onClick={() => setOpen(true)}
          disabled={disabled || loading}
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
      <ActionDialog
        confirmButtonState="default"
        title={intl.formatMessage({
          defaultMessage: "Assign Warehouses",
          id: "mFC5Rq",
        })}
        onConfirm={() => {
          // TODO: remove this when we migrate this section to react hook form
          warehouses.forEach(warehouse => {
            onWarehouseSelect(warehouse.value, warehouse.label);
          });
          setOpen(false);
          setWarehouses([]);
        }}
        open={open}
        onClose={() => {
          setOpen(false);
          setWarehouses([]);
        }}
      >
        <Multiselect
          options={warehousesToAssign.map(warehouse => ({
            label: warehouse.name,
            value: warehouse.id,
          }))}
          label={intl.formatMessage({
            defaultMessage: "Select warehouses",
            id: "Ejexo6",
          })}
          value={warehouses}
          fetchOptions={searchWarehouses}
          fetchMore={{
            onFetchMore: loadMoreWarehouses,
            hasMore: hasMoreWarehouses,
            loading,
          }}
          onChange={selected => {
            setWarehouses(selected.target.value);
          }}
        />
      </ActionDialog>
    </Box>
  );
};
