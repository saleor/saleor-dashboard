import Skeleton from "@dashboard/components/Skeleton";
import { useStyles } from "@dashboard/custom-apps/components/WebhookEvents/styles";
import {
  AppsListDocument,
  AppsListQuery,
  AppsListQueryVariables,
  AttributeListDocument,
  AttributeListQuery,
  AttributeListQueryVariables,
  CategoryDetailsQuery,
  CategoryDetailsQueryVariables,
  ChannelListDocument,
  CheckoutListDocument,
  CheckoutListQuery,
  CheckoutListQueryVariables,
  CollectionListDocument,
  CollectionListQuery,
  CollectionListQueryVariables,
  CustomerAddressesDocument,
  CustomerAddressesQuery,
  CustomerAddressesQueryVariables,
  CustomerDetailsQuery,
  CustomerDetailsQueryVariables,
  GiftCardListDocument,
  GiftCardListQuery,
  GiftCardListQueryVariables,
  ListCustomersDocument,
  ListCustomersQuery,
  ListCustomersQueryVariables,
  MenuListDocument,
  MenuListQuery,
  MenuListQueryVariables,
  OrderFulfillDataDocument,
  OrderFulfillDataQuery,
  OrderFulfillDataQueryVariables,
  OrderListDocument,
  OrderListQuery,
  OrderListQueryVariables,
  PageListDocument,
  PageListQuery,
  PageListQueryVariables,
  ProductListDocument,
  ProductListQuery,
  ProductListQueryVariables,
  ProductVariantListDocument,
  ProductVariantListQuery,
  ProductVariantListQueryVariables,
  RootCategoriesDocument,
  RootCategoriesQuery,
  RootCategoriesQueryVariables,
  SaleListDocument,
  SaleListQuery,
  SaleListQueryVariables,
  ShippingZonesDocument,
  StaffListDocument,
  StaffListQuery,
  StaffListQueryVariables,
  VoucherListDocument,
  VoucherListQuery,
  VoucherListQueryVariables,
  WarehouseListDocument,
  WarehouseListQuery,
  WarehouseListQueryVariables,
} from "@dashboard/graphql";
import { useQuery } from "@dashboard/hooks/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Radio } from "@material-ui/core";
import {
  List,
  ListBody,
  ListHeader,
  ListItem,
  ListItemCell,
  useListWidths,
} from "@saleor/macaw-ui";
import { DocumentNode } from "graphql";
import camelCase from "lodash/camelCase";
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import Avatar from "../TableCellAvatar/Avatar";

const messages = defineMessages({
  item: {
    id: "Xz/sDf",
    defaultMessage: "Item:",
    description: "Dry run items list item",
  },
});

interface DryRunItemsListProps {
  objectId: string;
  setObjectId: React.Dispatch<any>;
  object: string;
}

type TData =
  | ProductListQuery
  | OrderListQuery
  | GiftCardListQuery
  | CustomerAddressesQuery
  | AppsListQuery
  | AttributeListQuery
  | CategoryDetailsQuery
  | CheckoutListQuery
  | GiftCardListQuery
  | CollectionListQuery
  | CustomerDetailsQuery
  | OrderFulfillDataQuery
  | ListCustomersQuery
  | MenuListQuery
  | OrderListQuery
  | PageListQuery
  | ProductListQuery
  | ProductVariantListQuery
  | RootCategoriesQuery
  | SaleListQuery
  | StaffListQuery
  | VoucherListQuery
  | WarehouseListQuery;

type TVariables =
  | ProductListQueryVariables
  | OrderListQueryVariables
  | GiftCardListQueryVariables
  | CustomerAddressesQueryVariables
  | AppsListQueryVariables
  | AttributeListQueryVariables
  | CategoryDetailsQueryVariables
  | ListCustomersQueryVariables
  | CheckoutListQueryVariables
  | GiftCardListQueryVariables
  | CollectionListQueryVariables
  | CustomerDetailsQueryVariables
  | OrderFulfillDataQueryVariables
  | MenuListQueryVariables
  | OrderListQueryVariables
  | PageListQueryVariables
  | ProductListQueryVariables
  | ProductVariantListQueryVariables
  | RootCategoriesQueryVariables
  | SaleListQueryVariables
  | StaffListQueryVariables
  | VoucherListQueryVariables
  | WarehouseListQueryVariables;

export const DryRunItemsList = (props: DryRunItemsListProps) => {
  const classes = useStyles();
  const { checkbox } = useListWidths();
  const { object, objectId, setObjectId } = props;
  const objectDocument = DocumentMap[object];
  const objectCollection =
    objectDocument.collection ?? camelCase(`${object.toLowerCase()}s`);

  const { data, loading } = useQuery<TData, TVariables>(
    objectDocument.document,
    {
      displayLoader: true,
      variables: objectDocument.variables,
    },
  );

  return (
    <List gridTemplate={["1fr", checkbox, checkbox]}>
      <ListHeader>
        <ListItem className={classes.listHeader}>
          <ListItemCell className={classes.listItemCell}>
            <FormattedMessage {...messages.item} />
            &nbsp;
            {objectDocument.collection
              ?.split(/(?=[A-Z])/)
              .map(item => item.toLowerCase())
              .join(" ")}
            &nbsp;
            {objectDocument.displayedAttribute}
          </ListItemCell>
        </ListItem>
      </ListHeader>
      <ListBody className={classes.listBody}>
        {loading ? (
          <ListItem className={classes.listItem}>
            <ListItemCell className={classes.listItemCell}>
              <Skeleton />
            </ListItemCell>
            <ListItemCell>
              <Skeleton />
            </ListItemCell>
            <ListItemCell>
              <Skeleton />
            </ListItemCell>
          </ListItem>
        ) : (
          (mapEdgesToItems<any>(data[objectCollection]) || []).map(
            (item, idx) => (
              <ListItem
                className={classes.listItem}
                key={idx}
                onClick={() => setObjectId(item.id)}
              >
                <ListItemCell className={classes.listItemCell}>
                  {item.name ||
                    item[objectDocument.displayedAttribute] ||
                    item.id ||
                    item.__typename}
                </ListItemCell>
                <ListItemCell>
                  {item.thumbnail && <Avatar thumbnail={item.thumbnail?.url} />}
                </ListItemCell>
                <ListItemCell>
                  <Radio checked={item.id === objectId} />
                </ListItemCell>
              </ListItem>
            ),
          )
        )}
      </ListBody>
    </List>
  );
};

export default DryRunItemsList;

const DefaultVariables = {
  first: 100,
};

interface Document {
  document: DocumentNode;
  variables: TVariables;
  collection?: string;
  displayedAttribute?: string;
}

const DocumentMap: Record<string, Document> = {
  APP: {
    document: AppsListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  ATTRIBUTE: {
    document: AttributeListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  CATEGORY: {
    document: RootCategoriesDocument,
    variables: DefaultVariables,
    collection: "categories",
    displayedAttribute: "name",
  },
  GIFT_CARD: {
    document: GiftCardListDocument,
    variables: DefaultVariables,
    displayedAttribute: "last4CodeChars",
  },
  CHECKOUT: {
    document: CheckoutListDocument,
    variables: DefaultVariables,
    displayedAttribute: "id",
  },
  COLLECTION: {
    document: CollectionListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  CUSTOMER: {
    document: ListCustomersDocument,
    variables: DefaultVariables,
    displayedAttribute: "email",
    // TODO inverted name
  },

  INVOICE: {
    document: OrderListDocument,
    variables: DefaultVariables,
    collection: "orders",
    displayedAttribute: "number",
  },
  MENU: {
    document: MenuListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  ORDER: {
    document: OrderListDocument,
    variables: DefaultVariables,
    displayedAttribute: "number",
  },
  PAGE: {
    document: PageListDocument,
    variables: DefaultVariables,
    displayedAttribute: "title",
  },
  PRODUCT: {
    document: ProductListDocument,
    variables: {
      first: 100,
      hasChannel: true,
      hasSelectedAttributes: true,
    },
    displayedAttribute: "name",
  },
  SALE: {
    document: SaleListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  SHIPPING_PRICE: {
    document: ShippingZonesDocument,
    variables: DefaultVariables,
    collection: "shippingZones",
    displayedAttribute: "name",
  },
  SHIPPING_ZONE: {
    document: ShippingZonesDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
  STAFF: {
    document: StaffListDocument,
    variables: DefaultVariables,
    collection: "staffUsers",
    displayedAttribute: "email",
  },
  VOUCHER: {
    document: VoucherListDocument,
    variables: DefaultVariables,
    displayedAttribute: "code",
  },
  WAREHOUSE: {
    document: WarehouseListDocument,
    variables: DefaultVariables,
    displayedAttribute: "name",
  },
};

// Documents which require parent object or can't be handled ATM
//
export const ExcludedDocumentMap: Record<string, Document> = {
  ADDRESS: {
    document: CustomerAddressesDocument,
    variables: {
      // USER ID REQUIRED
      first: 100,
    },
  },
  // it's not a countable collection
  CHANNEL: {
    document: ChannelListDocument,
    variables: {},
  },
  FULFILLMENT: {
    document: OrderFulfillDataDocument,
    variables: {
      // ORDER ID REQUIRED
      first: 100,
    },
  },
  PRODUCT_VARIANT: {
    document: ProductVariantListDocument,
    variables: {
      // PRODUCT ID REQUIRED
      first: 100,
    },
  },
  TRANSLATION: {
    document: null,
    variables: {},
  },
};
