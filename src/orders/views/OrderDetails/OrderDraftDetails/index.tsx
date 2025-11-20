// @ts-strict-ignore
import { FetchResult } from "@apollo/client";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  OrderDetailsWithMetadataQueryResult,
  OrderDraftCancelMutation,
  OrderDraftCancelMutationVariables,
  OrderDraftFinalizeMutation,
  OrderDraftFinalizeMutationVariables,
  OrderDraftUpdateMutation,
  OrderDraftUpdateMutationVariables,
  OrderLineUpdateMutation,
  OrderLineUpdateMutationVariables,
  OrderNoteUpdateMutation,
  OrderNoteUpdateMutationVariables,
  StockAvailability,
  useChannelUsabilityDataQuery,
  useCustomerAddressesQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { CustomerEditData } from "@dashboard/orders/components/OrderCustomer";
import { OrderCustomerAddressesEditDialogOutput } from "@dashboard/orders/components/OrderCustomerAddressesEditDialog/types";
import {
  CustomerChangeActionEnum,
  OrderCustomerChangeData,
} from "@dashboard/orders/components/OrderCustomerChangeDialog/form";
import OrderCustomerChangeDialog from "@dashboard/orders/components/OrderCustomerChangeDialog/OrderCustomerChangeDialog";
import { OrderLineMetadataDialog } from "@dashboard/orders/components/OrderLineMetadataDialog/OrderLineMetadataDialog";
import { getVariantSearchAddress, isAnyAddressEditModalOpen } from "@dashboard/orders/utils/data";
import { OrderDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import { useOrderVariantSearch } from "@dashboard/searches/useOrderVariantSearch";
import { PartialMutationProviderOutput } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import { extractMutationErrors, getStringOrPlaceholder } from "../../../../misc";
import { productUrl } from "../../../../products/urls";
import OrderAddressFields from "../../../components/OrderAddressFields/OrderAddressFields";
import OrderDraftCancelDialog from "../../../components/OrderDraftCancelDialog/OrderDraftCancelDialog";
import OrderDraftPage from "../../../components/OrderDraftPage/OrderDraftPage";
import OrderProductAddDialog from "../../../components/OrderProductAddDialog";
import OrderShippingMethodEditDialog from "../../../components/OrderShippingMethodEditDialog";
import { orderDraftListUrl, OrderUrlDialog, OrderUrlQueryParams } from "../../../urls";

interface OrderDraftDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  loading: any;
  data: OrderDetailsWithMetadataQueryResult["data"];
  orderAddNote: any;
  orderUpdateNote: PartialMutationProviderOutput<
    OrderNoteUpdateMutation,
    OrderNoteUpdateMutationVariables
  >;
  orderLineUpdate: PartialMutationProviderOutput<
    OrderLineUpdateMutation,
    OrderLineUpdateMutationVariables
  >;
  orderLineDelete: any;
  orderShippingMethodUpdate: any;
  orderLinesAdd: any;
  orderDraftUpdate: PartialMutationProviderOutput<
    OrderDraftUpdateMutation,
    OrderDraftUpdateMutationVariables
  >;
  orderDraftCancel: PartialMutationProviderOutput<
    OrderDraftCancelMutation,
    OrderDraftCancelMutationVariables
  >;
  orderDraftFinalize: PartialMutationProviderOutput<
    OrderDraftFinalizeMutation,
    OrderDraftFinalizeMutationVariables
  >;
  openModal: (action: OrderUrlDialog, newParams?: OrderUrlQueryParams) => void;
  closeModal: any;
}

export const OrderDraftDetails = ({
  id,
  params,
  loading,
  data,
  orderAddNote,
  orderUpdateNote,
  orderLineUpdate,
  orderLineDelete,
  orderShippingMethodUpdate,
  orderLinesAdd,
  orderDraftUpdate,
  orderDraftCancel,
  orderDraftFinalize,
  openModal,
  closeModal,
}: OrderDraftDetailsProps) => {
  const order = data.order;
  const navigate = useNavigator();
  const { data: channelUsabilityData } = useChannelUsabilityDataQuery({
    variables: {
      channel: order.channel.slug,
    },
  });
  const {
    loadMore,
    search: variantSearch,
    result: variantSearchOpts,
  } = useOrderVariantSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel: order.channel.slug,
      address: getVariantSearchAddress(order),
      isPublished: true,
      stockAvailability: StockAvailability.IN_STOCK,
    },
  });
  const {
    loadMore: loadMoreCustomers,
    search: searchUsers,
    result: users,
  } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const { data: customerAddresses, loading: customerAddressesLoading } = useCustomerAddressesQuery({
    variables: {
      id: order?.user?.id,
    },
    skip: !order?.user?.id || !isAnyAddressEditModalOpen(params.action),
  });
  const intl = useIntl();
  const handleCustomerChange = async ({
    user,
    userEmail,
    prevUser,
    prevUserEmail,
  }: CustomerEditData) => {
    const sameUser = user && user === prevUser;
    const sameUserEmail = userEmail && userEmail === prevUserEmail;

    if (sameUser || sameUserEmail) {
      return;
    }

    const result = await orderDraftUpdate.mutate({
      id,
      input: {
        user,
        userEmail,
      },
    });

    if (result?.data?.draftOrderUpdate?.errors?.length) {
      return;
    }

    const modalUri = prevUser ? "customer-change" : "edit-customer-addresses";

    openModal(modalUri);
  };
  const handleCustomerChangeAction = (data: OrderCustomerChangeData) => {
    if (data.changeActionOption === CustomerChangeActionEnum.CHANGE_ADDRESS) {
      openModal("edit-customer-addresses");
    } else {
      closeModal();
    }
  };
  const handleCustomerChangeAddresses = async (
    data: Partial<OrderCustomerAddressesEditDialogOutput>,
  ): Promise<FetchResult<OrderDraftUpdateMutation>> => orderDraftUpdate.mutate({ id, input: data });
  const handleOrderDraftCancel = async () => {
    const errors = await extractMutationErrors(orderDraftCancel.mutate({ id }));

    if (!errors.length) {
      navigate(orderDraftListUrl());
    }

    return errors;
  };
  const errors = orderDraftFinalize.opts.data?.draftOrderComplete.errors || [];

  return (
    <>
      <WindowTitle
        title={intl.formatMessage(
          {
            id: "TLNf6K",
            defaultMessage: "Draft Order #{orderNumber}",
            description: "window title",
          },
          {
            orderNumber: getStringOrPlaceholder(data?.order?.number),
          },
        )}
      />

      <OrderDiscountProvider order={order}>
        <OrderLineDiscountProvider order={order}>
          <OrderDraftPage
            loading={loading}
            disabled={loading}
            errors={errors}
            onNoteUpdateLoading={orderUpdateNote.opts.loading}
            onNoteUpdate={(id, message) =>
              orderUpdateNote.mutate({
                order: id,
                input: {
                  message,
                },
              })
            }
            onNoteAdd={variables =>
              extractMutationErrors(
                orderAddNote.mutate({
                  input: variables,
                  order: id,
                }),
              )
            }
            users={mapEdgesToItems(users?.data?.search)}
            hasMore={users?.data?.search?.pageInfo?.hasNextPage || false}
            onFetchMore={loadMoreCustomers}
            fetchUsers={searchUsers}
            usersLoading={users.loading}
            onCustomerEdit={handleCustomerChange}
            onDraftFinalize={() => orderDraftFinalize.mutate({ id })}
            onDraftRemove={() => openModal("cancel")}
            onOrderLineAdd={() => openModal("add-order-line")}
            onOrderLineShowMetadata={id => openModal("view-order-line-metadata", { id })}
            order={order}
            channelUsabilityData={channelUsabilityData}
            onProductClick={id => () => navigate(productUrl(encodeURIComponent(id)))}
            onBillingAddressEdit={() => openModal("edit-billing-address")}
            onShippingAddressEdit={() => openModal("edit-shipping-address")}
            onShippingMethodEdit={() => openModal("edit-shipping")}
            onOrderLineRemove={id => orderLineDelete.mutate({ id })}
            onOrderLineChange={(id, data) =>
              orderLineUpdate.mutate({
                id,
                input: data,
              })
            }
            saveButtonBarState={orderDraftFinalize.opts.status}
            onProfileView={() => navigate(customerUrl(order.user.id))}
          />
        </OrderLineDiscountProvider>
      </OrderDiscountProvider>
      <OrderDraftCancelDialog
        confirmButtonState={orderDraftCancel.opts.status}
        errors={orderDraftCancel.opts.data?.draftOrderDelete.errors || []}
        onClose={closeModal}
        onConfirm={handleOrderDraftCancel}
        open={params.action === "cancel"}
        orderNumber={getStringOrPlaceholder(order?.number)}
      />
      <OrderShippingMethodEditDialog
        confirmButtonState={orderShippingMethodUpdate.opts.status}
        errors={orderShippingMethodUpdate.opts.data?.orderUpdateShipping.errors || []}
        open={params.action === "edit-shipping"}
        shippingMethod={order?.shippingMethod?.id}
        shippingMethods={order?.shippingMethods}
        onClose={closeModal}
        onSubmit={variables =>
          orderShippingMethodUpdate.mutate({
            id,
            input: {
              shippingMethod: variables.shippingMethod,
            },
          })
        }
      />
      <OrderProductAddDialog
        confirmButtonState={orderLinesAdd.opts.status}
        errors={orderLinesAdd.opts.data?.orderLinesCreate.errors || []}
        loading={variantSearchOpts.loading}
        open={params.action === "add-order-line"}
        hasMore={variantSearchOpts.data?.search.pageInfo.hasNextPage}
        products={mapEdgesToItems(variantSearchOpts?.data?.search)}
        onClose={closeModal}
        onFetch={variantSearch}
        onFetchMore={loadMore}
        channelName={order.channel.name}
        onSubmit={variants =>
          extractMutationErrors(
            orderLinesAdd.mutate({
              id,
              input: variants.map(variant => ({
                quantity: 1,
                variantId: variant.id,
              })),
            }),
          )
        }
      />
      <OrderCustomerChangeDialog
        open={params.action === "customer-change"}
        onClose={closeModal}
        onConfirm={handleCustomerChangeAction}
      />
      <OrderLineMetadataDialog
        open={params.action === "view-order-line-metadata"}
        onClose={closeModal}
        lineId={params.id}
        orderId={id}
      />
      <OrderAddressFields
        action={params?.action}
        orderShippingAddress={order?.shippingAddress}
        orderBillingAddress={order?.billingAddress}
        customerAddressesLoading={customerAddressesLoading}
        isDraft
        countries={data?.shop?.countries}
        customer={customerAddresses?.user}
        onClose={closeModal}
        onConfirm={handleCustomerChangeAddresses}
        confirmButtonState={orderDraftUpdate.opts.status}
        errors={orderDraftUpdate.opts.data?.draftOrderUpdate.errors}
      />
    </>
  );
};
