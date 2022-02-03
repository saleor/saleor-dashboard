import { useUser } from "@saleor/auth";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { useCustomerAddressesQuery } from "@saleor/customers/queries";
import useNavigator from "@saleor/hooks/useNavigator";
import { CustomerEditData } from "@saleor/orders/components/OrderCustomer";
import { OrderCustomerAddressesEditDialogOutput } from "@saleor/orders/components/OrderCustomerAddressesEditDialog/types";
import {
  CustomerChangeActionEnum,
  OrderCustomerChangeData
} from "@saleor/orders/components/OrderCustomerChangeDialog/form";
import OrderCustomerChangeDialog from "@saleor/orders/components/OrderCustomerChangeDialog/OrderCustomerChangeDialog";
import { OrderDetails } from "@saleor/orders/types/OrderDetails";
import {
  OrderDraftUpdate,
  OrderDraftUpdateVariables
} from "@saleor/orders/types/OrderDraftUpdate";
import { getVariantSearchAddress } from "@saleor/orders/utils/data";
import { OrderDiscountProvider } from "@saleor/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@saleor/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import { PartialMutationProviderOutput } from "@saleor/types";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { customerUrl } from "../../../../customers/urls";
import {
  extractMutationErrors,
  getStringOrPlaceholder
} from "../../../../misc";
import { productUrl } from "../../../../products/urls";
import OrderAddressFields from "../../../components/OrderAddressFields/OrderAddressFields";
import OrderDraftCancelDialog from "../../../components/OrderDraftCancelDialog/OrderDraftCancelDialog";
import OrderDraftPage from "../../../components/OrderDraftPage";
import OrderProductAddDialog from "../../../components/OrderProductAddDialog";
import OrderShippingMethodEditDialog from "../../../components/OrderShippingMethodEditDialog";
import { useOrderVariantSearch } from "../../../queries";
import { OrderUrlDialog, OrderUrlQueryParams } from "../../../urls";
import { orderDraftListUrl } from "../../../urls";

interface OrderDraftDetailsProps {
  id: string;
  params: OrderUrlQueryParams;
  loading: any;
  data: OrderDetails;
  orderAddNote: any;
  orderLineUpdate: any;
  orderLineDelete: any;
  orderShippingMethodUpdate: any;
  orderLinesAdd: any;
  orderDraftUpdate: PartialMutationProviderOutput<
    OrderDraftUpdate,
    OrderDraftUpdateVariables
  >;
  orderDraftCancel: any;
  orderDraftFinalize: any;
  openModal: (action: OrderUrlDialog, newParams?: OrderUrlQueryParams) => void;
  closeModal: any;
}

export const isAnyAddressEditModalOpen = (uri: string | undefined): boolean =>
  [
    "edit-customer-addresses",
    "edit-shipping-address",
    "edit-billing-address"
  ].includes(uri);

export const OrderDraftDetails: React.FC<OrderDraftDetailsProps> = ({
  id,
  params,
  loading,
  data,
  orderAddNote,
  orderLineUpdate,
  orderLineDelete,
  orderShippingMethodUpdate,
  orderLinesAdd,
  orderDraftUpdate,
  orderDraftCancel,
  orderDraftFinalize,
  openModal,
  closeModal
}) => {
  const order = data.order;
  const navigate = useNavigator();
  const { user } = useUser();

  const {
    loadMore,
    search: variantSearch,
    result: variantSearchOpts
  } = useOrderVariantSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel: order.channel.slug,
      address: getVariantSearchAddress(order)
    }
  });

  const {
    loadMore: loadMoreCustomers,
    search: searchUsers,
    result: users
  } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const {
    data: customerAddresses,
    loading: customerAddressesLoading
  } = useCustomerAddressesQuery({
    variables: {
      id: order?.user?.id
    },
    skip: !order?.user?.id || !isAnyAddressEditModalOpen(params.action)
  });

  const intl = useIntl();

  const handleCustomerChange = async ({
    user,
    userEmail,
    prevUser,
    prevUserEmail
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
        userEmail
      }
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
    data: Partial<OrderCustomerAddressesEditDialogOutput>
  ): Promise<any> =>
    orderDraftUpdate.mutate({
      id,
      input: data
    });

  return (
    <>
      <WindowTitle
        title={intl.formatMessage(
          {
            defaultMessage: "Draft Order #{orderNumber}",
            description: "window title"
          },
          {
            orderNumber: getStringOrPlaceholder(data?.order?.number)
          }
        )}
      />

      <OrderDiscountProvider order={order}>
        <OrderLineDiscountProvider order={order}>
          <OrderDraftPage
            disabled={loading}
            onNoteAdd={variables =>
              extractMutationErrors(
                orderAddNote.mutate({
                  input: variables,
                  order: id
                })
              )
            }
            users={mapEdgesToItems(users?.data?.search)}
            hasMore={users?.data?.search?.pageInfo?.hasNextPage || false}
            onFetchMore={loadMoreCustomers}
            fetchUsers={searchUsers}
            loading={users.loading}
            usersLoading={users.loading}
            onCustomerEdit={handleCustomerChange}
            onDraftFinalize={() => orderDraftFinalize.mutate({ id })}
            onDraftRemove={() => openModal("cancel")}
            onOrderLineAdd={() => openModal("add-order-line")}
            onBack={() => navigate(orderDraftListUrl())}
            order={order}
            onProductClick={id => () =>
              navigate(productUrl(encodeURIComponent(id)))}
            onBillingAddressEdit={() => openModal("edit-billing-address")}
            onShippingAddressEdit={() => openModal("edit-shipping-address")}
            onShippingMethodEdit={() => openModal("edit-shipping")}
            onOrderLineRemove={id => orderLineDelete.mutate({ id })}
            onOrderLineChange={(id, data) =>
              orderLineUpdate.mutate({
                id,
                input: data
              })
            }
            saveButtonBarState="default"
            onProfileView={() => navigate(customerUrl(order.user.id))}
            userPermissions={user?.userPermissions || []}
          />
        </OrderLineDiscountProvider>
      </OrderDiscountProvider>
      <OrderDraftCancelDialog
        confirmButtonState={orderDraftCancel.opts.status}
        errors={orderDraftCancel.opts.data?.draftOrderDelete.errors || []}
        onClose={closeModal}
        onConfirm={() => orderDraftCancel.mutate({ id })}
        open={params.action === "cancel"}
        orderNumber={getStringOrPlaceholder(order?.number)}
      />
      <OrderShippingMethodEditDialog
        confirmButtonState={orderShippingMethodUpdate.opts.status}
        errors={
          orderShippingMethodUpdate.opts.data?.orderUpdateShipping.errors || []
        }
        open={params.action === "edit-shipping"}
        shippingMethod={order?.shippingMethod?.id}
        shippingMethods={order?.shippingMethods}
        onClose={closeModal}
        onSubmit={variables =>
          orderShippingMethodUpdate.mutate({
            id,
            input: {
              shippingMethod: variables.shippingMethod
            }
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
        selectedChannelId={order?.channel?.id}
        onClose={closeModal}
        onFetch={variantSearch}
        onFetchMore={loadMore}
        onSubmit={variants =>
          extractMutationErrors(
            orderLinesAdd.mutate({
              id,
              input: variants.map(variant => ({
                quantity: 1,
                variantId: variant.id
              }))
            })
          )
        }
      />
      <OrderCustomerChangeDialog
        open={params.action === "customer-change"}
        onClose={closeModal}
        onConfirm={handleCustomerChangeAction}
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

export default OrderDraftDetails;
