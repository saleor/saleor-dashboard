import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ListPageLayout } from "@dashboard/components/Layouts";
import {
  discountAddUrl,
  DiscountListUrlSortField,
  discountUrl,
} from "@dashboard/discounts/discountsUrls";
import { PromotionFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { commonMessages } from "@dashboard/intl";
import { PageListProps, SortPage } from "@dashboard/types";
import { Card } from "@material-ui/core";
import { Box, Button, ChevronRightIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DiscountListDatagrid } from "../DiscountListDatagrid";

export interface DiscountListPageProps
  extends PageListProps,
    SortPage<DiscountListUrlSortField> {
  onSearchChange: (query: string) => void;
  initialSearch: string;
  promotions: PromotionFragment[];
}

const DiscountListPage: React.FC<DiscountListPageProps> = ({
  initialSearch,
  onSearchChange,
  ...listProps
}) => {
  const intl = useIntl();
  const navigation = useNavigator();

  const handleRowClick = (id: string) => {
    navigation(discountUrl(id));
  };

  return (
    <ListPageLayout>
      <TopNav
        isAlignToRight={false}
        withoutBorder
        title={intl.formatMessage(commonMessages.discounts)}
      >
        <Box
          __flex={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>
            <Text variant="title" size="small">
              <FormattedMessage
                id="YZ9A2I"
                defaultMessage="All discounts"
                description="header"
              />
            </Text>
          </Box>
          <Box>
            <Button
              onClick={() => navigation(discountAddUrl())}
              variant="primary"
              data-test-id="create-sale"
            >
              <FormattedMessage
                id="+MJW+8"
                defaultMessage="Create Discount"
                description="button"
              />
            </Button>
          </Box>
        </Box>
      </TopNav>

      <Card>
        <Box __width="320px" marginLeft={4} marginBottom={2}>
          {/* TODO: remove when new fileters will be implemented */}
          <SearchInput
            initialSearch={initialSearch}
            placeholder={intl.formatMessage({
              id: "+bhokL",
              defaultMessage: "Search discounts...",
            })}
            onSearchChange={onSearchChange}
          />
        </Box>
        <DiscountListDatagrid {...listProps} onRowClick={handleRowClick} />
      </Card>
    </ListPageLayout>
  );
};
DiscountListPage.displayName = "SaleListPage";
export default DiscountListPage;
