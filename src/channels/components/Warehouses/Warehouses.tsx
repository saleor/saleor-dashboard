import { type ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { DashboardCard } from "@dashboard/components/Card";
import { type SearchWarehousesQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { type FetchMoreProps, type RelayToFlat, type ReorderAction } from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignmentList } from "../AssignmentList/AssignmentList";
import { messages } from "./messages";

interface WarehousesProps {
  addWarehouse: (id: string) => void;
  removeWarehouse: (id: string) => void;
  searchWarehouses: (searchPhrase: string) => void;
  reorderWarehouses: ReorderAction;
  loading: boolean;
  totalCount: number;
  fetchMoreWarehouses: FetchMoreProps;
  warehouses: ChannelWarehouses;
  warehousesChoices: RelayToFlat<SearchWarehousesQuery["search"]>;
  onCreateWarehouse?: () => void;
}

const Warehouses = ({
  addWarehouse,
  removeWarehouse,
  searchWarehouses,
  reorderWarehouses,
  loading,
  totalCount,
  fetchMoreWarehouses,
  warehouses,
  warehousesChoices,
  onCreateWarehouse,
}: WarehousesProps) => {
  const intl = useIntl();
  const showCreateEmptyState = !loading && totalCount === 0 && warehouses.length === 0;

  return (
    <DashboardCard data-test-id="warehouses-section">
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.warehouses)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text>{intl.formatMessage(messages.subtitle)}</Text>
      </DashboardCard.Content>
      {showCreateEmptyState && onCreateWarehouse ? (
        <Box paddingX={6} paddingBottom={4}>
          <Button
            variant="secondary"
            data-test-id="sidebar-create-warehouse"
            onClick={onCreateWarehouse}
          >
            <FormattedMessage
              id="S1ZnJd"
              defaultMessage="Create warehouse"
              description="empty warehouses sidebar CTA"
            />
          </Button>
        </Box>
      ) : (
        <AssignmentList
          loading={loading}
          items={warehouses}
          itemsChoices={warehousesChoices!}
          addItem={addWarehouse}
          removeItem={removeWarehouse}
          searchItems={searchWarehouses}
          reorderItem={reorderWarehouses}
          fetchMoreItems={fetchMoreWarehouses}
          totalCount={totalCount}
          dataTestId="warehouse"
          inputName="warehouse"
          itemsName={intl.formatMessage(sectionNames.warehouses)}
        />
      )}
    </DashboardCard>
  );
};

export default Warehouses;
