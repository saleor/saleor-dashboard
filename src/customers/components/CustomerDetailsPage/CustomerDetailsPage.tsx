// @ts-strict-ignore
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { Attributes } from "@dashboard/components/Attributes";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Savebar } from "@dashboard/components/Savebar";
import { useCanEditCustomers } from "@dashboard/customers/hooks/useCanEditCustomers";
import {
  type CustomerDetailsAttributeSubmitData,
  useCustomerDetailsAttributes,
} from "@dashboard/customers/hooks/useCustomerDetailsAttributes";
import { defaultGraphiQLQuery } from "@dashboard/customers/queries";
import { customerAddressesUrl, customerListPath } from "@dashboard/customers/urls";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForCustomerDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { CustomerGiftCardsCard } from "@dashboard/giftCards/components/GiftCardCustomerCard/CustomerGiftCardsCard";
import {
  type AccountErrorFragment,
  type CustomerDetailsQuery,
  PermissionEnum,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { type FormsetData } from "@dashboard/hooks/useFormset";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderListUrlWithCustomerEmail } from "@dashboard/orders/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Divider } from "@saleor/macaw-ui-next";
import { type MutableRefObject, type ReactNode, useEffect, useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { AccountStatusCard } from "../AccountStatusCard/AccountStatusCard";
import CustomerAddresses from "../CustomerAddresses";
import CustomerInfo from "../CustomerInfo";
import CustomerOrders from "../CustomerOrders";
import { CustomerOverview } from "../CustomerOverview/CustomerOverview";
import { CustomerTypeCard } from "../CustomerTypeCard/CustomerTypeCard";
import { ExternalReferenceCard } from "../ExternalReferenceCard/ExternalReferenceCard";
import { CustomerDetailsTitle } from "./Title";

const messages = defineMessages({
  openGraphiQL: {
    id: "oUkVpp",
    defaultMessage: "Open this customer in GraphiQL",
  },
});

export interface CustomerDetailsPageFormData {
  firstName: string;
  lastName: string;
  email: string;
  note: string;
  customerTypeId: string;
}

export interface CustomerDetailsPageSubmitData
  extends CustomerDetailsPageFormData,
    CustomerDetailsAttributeSubmitData {}

interface CustomerDetailsPageProps {
  attributeFormRevision?: number;
  customerId: string;
  customer: CustomerDetailsQuery["user"];
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onSubmit: (data: CustomerDetailsPageSubmitData) => SubmitPromise<AccountErrorFragment[]>;
  onDelete: () => void;
  onActivateToggle: () => void;
  onShowMetadata: () => void;
}

const emptyAttributeSubmitData = async (): Promise<CustomerDetailsAttributeSubmitData> => ({
  attributes: [],
  attributesWithNewFileValue: [] as FormsetData<null, File>,
});

const CustomerDetailsPage = ({
  attributeFormRevision = 0,
  customerId,
  customer,
  disabled,
  errors,
  saveButtonBar,
  onSubmit,
  onDelete,
  onActivateToggle,
  onShowMetadata,
}: CustomerDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  // Customer mutations all require MANAGE_USERS. Users with only
  // MANAGE_ORDERS / MANAGE_STAFF can read this page, but every editing
  // affordance (form fields, savebar, account actions, metadata) is
  // hidden or disabled below.
  //
  // Reading + writing customer metadata (public AND private) also requires
  // MANAGE_USERS for non-staff `User`s — see Saleor's
  // `meta/permissions.py::public_user_permissions` and `private_user_permissions`,
  // which key off `user.is_staff`. The customers list (`User.objects.customers`)
  // filters `is_staff=False`, so the resolver always returns `[MANAGE_USERS]`
  // for users reachable through this page. We therefore gate the metadata
  // button on the same `MANAGE_USERS` flag and don't expose a read-only
  // metadata view, since the server would deny it anyway.
  const canEditCustomers = useCanEditCustomers();
  const isReadOnly = !canEditCustomers;
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${customer?.id}" }`);
    context.setDevModeVisibility(true);
  };
  const getSubmitDataRef = useRef(emptyAttributeSubmitData);
  const initialForm: CustomerDetailsPageFormData = {
    customerTypeId: customer?.customerType?.id || "",
    email: customer?.email || "",
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    note: customer?.note || "",
  };
  const { CUSTOMER_DETAILS_MORE_ACTIONS, CUSTOMER_DETAILS_WIDGETS } = useExtensions(
    extensionMountPoints.CUSTOMER_DETAILS,
  );
  const extensionMenuItems = getExtensionsItemsForCustomerDetails(
    CUSTOMER_DETAILS_MORE_ACTIONS,
    customerId,
  );

  const customerBackLink = useBackLinkWithState({
    path: customerListPath,
  });

  // Account-level actions live in the cogs "More actions" menu so destructive
  // toggles (activate / deactivate) and Delete are not bundled with the form
  // save. Delete is also kept in the savebar for discoverability. Hidden in
  // read-only mode because they all hit the customerUpdate / customerDelete
  // mutations.
  const builtInMenuItems =
    customer && canEditCustomers
      ? [
          {
            label: customer.isActive
              ? intl.formatMessage({
                  defaultMessage: "Deactivate user",
                  description: "customer detail cogs menu, deactivates the customer account",
                  id: "zP3Rb6",
                })
              : intl.formatMessage({
                  defaultMessage: "Activate user",
                  description:
                    "customer detail cogs menu, activates a deactivated customer account",
                  id: "62Rs/K",
                }),
            onSelect: onActivateToggle,
            testId: customer.isActive ? "deactivate-user" : "activate-user",
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Delete user",
              description: "customer detail cogs menu, opens the delete-confirmation dialog",
              id: "LQg8/p",
            }),
            onSelect: onDelete,
            testId: "delete-user",
            color: "critical1" as const,
          },
        ]
      : [];
  const menuItems = [...builtInMenuItems, ...extensionMenuItems];

  menuItems.push({
    label: intl.formatMessage(messages.openGraphiQL),
    onSelect: openPlaygroundURL,
    testId: "graphiql-redirect",
  });

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={async formData => {
        const extras = await getSubmitDataRef.current();

        return onSubmit({ ...formData, ...extras });
      }}
      disabled={disabled}
    >
      {({ change, data, isSaveDisabled, submit, triggerChange }) => {
        return (
          <CustomerTypeAndAttributes
            key={`${customer?.id ?? "loading"}:${attributeFormRevision}`}
            customer={customer}
            customerTypeId={data.customerTypeId}
            disabled={disabled || isReadOnly}
            errors={errors}
            getSubmitDataRef={getSubmitDataRef}
            onTypeChange={type => {
              change({
                target: {
                  name: "customerTypeId",
                  value: type.id,
                },
              });
            }}
            triggerChange={triggerChange}
          >
            {({ attributesCard, typeCard }) => (
              <DetailPageLayout>
                <TopNav
                  href={customerBackLink}
                  hrefIcon={<TopNavDestinationIcon.customers />}
                  hrefTitle={intl.formatMessage(topNavDestinationMessages.allCustomers)}
                  title={<CustomerDetailsTitle customer={customer} loading={!customer} />}
                  actionsGap={3}
                >
                  {canEditCustomers && (
                    <TopNav.MetadataButton
                      onClick={onShowMetadata}
                      disabled={!customer}
                      data-test-id="show-customer-metadata"
                      title={intl.formatMessage({
                        defaultMessage: "Edit customer metadata",
                        description: "customer detail page, top-bar metadata button tooltip",
                        id: "DR3EBs",
                      })}
                    />
                  )}
                  {menuItems.length > 0 && <TopNav.Menu items={menuItems} dataTestId="menu" />}
                </TopNav>
                <DetailPageLayout.Content paddingBottom={10}>
                  <CustomerOverview customer={customer} />
                  <CardSpacer />
                  <CustomerInfo
                    data={data}
                    disabled={disabled || isReadOnly}
                    errors={errors}
                    onChange={change}
                  />
                  {attributesCard}
                  <CardSpacer />
                  <CustomerAddresses
                    customer={customer}
                    disabled={disabled}
                    manageAddressHref={customerAddressesUrl(customerId)}
                  />
                  <CardSpacer />
                  <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                    <CustomerOrders
                      orders={mapEdgesToItems(customer?.orders)}
                      viewAllHref={orderListUrlWithCustomerEmail(customer?.email)}
                    />
                  </RequirePermissions>
                </DetailPageLayout.Content>
                <DetailPageLayout.RightSidebar>
                  {typeCard}
                  <CardSpacer />
                  <AccountStatusCard customer={customer} />
                  <CardSpacer />
                  <ExternalReferenceCard customer={customer} />
                  <CardSpacer />
                  <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_GIFT_CARD]}>
                    <CustomerGiftCardsCard />
                  </RequirePermissions>
                  {CUSTOMER_DETAILS_WIDGETS.length > 0 && customer?.id && (
                    <>
                      <CardSpacer />
                      <Divider />
                      <AppWidgets
                        extensions={CUSTOMER_DETAILS_WIDGETS}
                        params={{ customerId: customer.id }}
                      />
                    </>
                  )}
                </DetailPageLayout.RightSidebar>
                <Savebar>
                  {canEditCustomers ? (
                    <>
                      <Savebar.DeleteButton onClick={onDelete} />
                      <Savebar.Spacer />
                      <Savebar.CancelButton onClick={() => navigate(customerBackLink)} />
                      <Savebar.ConfirmButton
                        transitionState={saveButtonBar}
                        onClick={submit}
                        disabled={isSaveDisabled}
                      />
                    </>
                  ) : (
                    <Savebar.ReadOnlyLabel />
                  )}
                </Savebar>
              </DetailPageLayout>
            )}
          </CustomerTypeAndAttributes>
        );
      }}
    </Form>
  );
};

interface CustomerTypeAndAttributesProps {
  children: (slots: { attributesCard: ReactNode; typeCard: ReactNode }) => ReactNode;
  customer: CustomerDetailsQuery["user"];
  customerTypeId: string;
  disabled: boolean;
  errors: AccountErrorFragment[];
  getSubmitDataRef: MutableRefObject<() => Promise<CustomerDetailsAttributeSubmitData>>;
  onTypeChange: (type: { id: string; name: string }) => void;
  triggerChange: () => void;
}

const CustomerTypeAndAttributes = ({
  children,
  customer,
  customerTypeId,
  disabled,
  errors,
  getSubmitDataRef,
  onTypeChange,
  triggerChange,
}: CustomerTypeAndAttributesProps) => {
  const intl = useIntl();
  const attributeForm = useCustomerDetailsAttributes({
    customer,
    triggerChange,
  });
  const [pickedType, setPickedType] = useState<{ id: string; name: string } | null>(null);
  const formErrors = getFormErrors(["customerType"], errors);

  useEffect(() => {
    getSubmitDataRef.current = attributeForm.getSubmitData;
  }, [attributeForm.getSubmitData, getSubmitDataRef]);

  const selectedType =
    pickedType && pickedType.id === customerTypeId
      ? pickedType
      : customer?.customerType
        ? { id: customer.customerType.id, name: customer.customerType.name }
        : null;

  const typeCard = (
    <CustomerTypeCard
      selectedType={selectedType}
      savedTypeId={customer?.customerType?.id ?? null}
      disabled={disabled || attributeForm.typeAttributesLoading}
      error={getAccountErrorMessage(formErrors.customerType, intl)}
      onChange={type => {
        setPickedType(type);
        onTypeChange(type);
        void attributeForm.handleTypeChange(type.id);
      }}
    />
  );
  const attributesCard =
    attributeForm.attributes.length > 0 ? (
      <>
        <CardSpacer />
        <Attributes
          attributes={attributeForm.attributes}
          attributeValues={attributeForm.attributeValues}
          disabled={disabled || attributeForm.typeAttributesLoading}
          errors={errors}
          fetchAttributeValues={attributeForm.fetchAttributeValues}
          fetchMoreAttributeValues={attributeForm.fetchMoreAttributeValues}
          loading={attributeForm.typeAttributesLoading}
          onAttributeSelectBlur={attributeForm.handlers.onAttributeSelectBlur}
          onChange={attributeForm.handlers.onChange}
          onFileChange={attributeForm.handlers.onFileChange}
          onMultiChange={attributeForm.handlers.onMultiChange}
          onReferencesAddClick={attributeForm.handlers.onReferencesAddClick}
          onReferencesRemove={attributeForm.handlers.onReferencesRemove}
          onReferencesReorder={attributeForm.handlers.onReferencesReorder}
          richTextGetters={attributeForm.attributeRichTextGetters}
        />
      </>
    ) : null;

  return children({ attributesCard, typeCard });
};

CustomerDetailsPage.displayName = "CustomerDetailsPage";
export default CustomerDetailsPage;
