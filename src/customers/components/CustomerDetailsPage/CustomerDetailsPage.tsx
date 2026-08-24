import {
  getReferenceAttributeEntityTypeFromAttribute,
  handleContainerReferenceAssignment,
  type ReferenceEntitiesSearch,
} from "@dashboard/attributes/utils/data";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import AssignAttributeValueDialog, {
  type AssignAttributeValueDialogFilterChangeMap,
} from "@dashboard/components/AssignAttributeValueDialog";
import { type Products } from "@dashboard/components/AssignProductDialog/types";
import { type AttributeInput, Attributes } from "@dashboard/components/Attributes";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import Form, { FormDirtyStateSync } from "@dashboard/components/Form";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type InitialPageConstraints } from "@dashboard/components/ModalFilters/entityConfigs/ModalPageFilterProvider";
import { type InitialConstraints } from "@dashboard/components/ModalFilters/entityConfigs/ModalProductFilterProvider";
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
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { commonMessages } from "@dashboard/intl";
import { orderListUrlWithCustomerEmail } from "@dashboard/orders/urls";
import { type Container, type FetchMoreProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Divider } from "@saleor/macaw-ui-next";
import { Trash2, UserCheck, UserX } from "lucide-react";
import {
  type MutableRefObject,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";

import CustomerAddresses from "../CustomerAddresses";
import { CustomerAttributesCard } from "../CustomerAttributesCard/CustomerAttributesCard";
import CustomerInfo from "../CustomerInfo";
import { CustomerOrders } from "../CustomerOrders/CustomerOrders";
import { CustomerOverview } from "../CustomerOverview/CustomerOverview";
import { ExternalReferenceCard } from "../ExternalReferenceCard/ExternalReferenceCard";
import { CustomerDetailsPageLoading } from "./CustomerDetailsPageLoading";
import { CustomerSaveCompositionHint } from "./CustomerSaveCompositionHint";
import { messages } from "./messages";
import { buildCustomerSaveComposition, hasCustomerSaveComposition } from "./saveComposition";
import { CustomerDetailsTitle } from "./Title";

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
  assignReferencesAttributeId?: string;
  customerId: string;
  customer: CustomerDetailsQuery["user"];
  disabled: boolean;
  errors: AccountErrorFragment[];
  fetchMoreReferenceCategories?: FetchMoreProps;
  fetchMoreReferenceCollections?: FetchMoreProps;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchReferenceCategories?: (data: string) => void;
  fetchReferenceCollections?: (data: string) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  initialConstraints?: InitialConstraints & InitialPageConstraints;
  onAssignReferencesClick?: (attribute: AttributeInput) => void;
  onCloseAssignReferences?: () => void;
  onFilterChange?: AssignAttributeValueDialogFilterChangeMap;
  onSubmit: (data: CustomerDetailsPageSubmitData) => SubmitPromise<AccountErrorFragment[]>;
  onDelete: () => void;
  onActivateToggle: () => void;
  onShowMetadata: () => void;
  referenceCategories?: ReferenceEntitiesSearch["categories"];
  referenceCollections?: ReferenceEntitiesSearch["collections"];
  referencePages?: ReferenceEntitiesSearch["pages"];
  referenceProducts?: ReferenceEntitiesSearch["products"];
  saveButtonBar: ConfirmButtonTransitionState;
}

const emptyAttributeSubmitData = async (): Promise<CustomerDetailsAttributeSubmitData> => ({
  attributes: [],
  attributesWithNewFileValue: [] as FormsetData<null, File>,
});

const noopAssignReferences = (_attribute: AttributeInput): void => undefined;

const CustomerDetailsPage = ({
  attributeFormRevision = 0,
  assignReferencesAttributeId,
  customerId,
  customer,
  disabled,
  errors,
  fetchMoreReferenceCategories,
  fetchMoreReferenceCollections,
  fetchMoreReferencePages,
  fetchMoreReferenceProducts,
  fetchReferenceCategories,
  fetchReferenceCollections,
  fetchReferencePages,
  fetchReferenceProducts,
  initialConstraints,
  onAssignReferencesClick,
  onCloseAssignReferences,
  onFilterChange,
  saveButtonBar,
  onSubmit,
  onDelete,
  onActivateToggle,
  onShowMetadata,
  referenceCategories = [],
  referenceCollections = [],
  referencePages = [],
  referenceProducts = [],
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
  const openPlaygroundURL = useCallback(() => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${customer?.id}" }`);
    context.setDevModeVisibility(true);
  }, [context, customer?.id]);
  const getSubmitDataRef = useRef(emptyAttributeSubmitData);
  const [attributesDirty, setAttributesDirty] = useState(false);
  const formIdentity = `${customer?.id ?? "loading"}:${attributeFormRevision}`;
  const [formIdentityState, setFormIdentityState] = useState(formIdentity);

  if (formIdentityState !== formIdentity) {
    setFormIdentityState(formIdentity);
    setAttributesDirty(false);
  }

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

  const menuItems = useMemo((): TopNavMenuItem[] => {
    const items: TopNavMenuItem[] = extensionMenuItems.map(item => ({
      label: item.label,
      onSelect: item.onSelect,
      testId: item.testId,
    }));

    if (customer && canEditCustomers) {
      items.push(
        customer.isActive
          ? {
              label: intl.formatMessage(messages.deactivateUser),
              onSelect: onActivateToggle,
              testId: "deactivate-user",
              icon: <UserX size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
            }
          : {
              label: intl.formatMessage(messages.activateUser),
              onSelect: onActivateToggle,
              testId: "activate-user",
              icon: <UserCheck size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
            },
      );
    }

    items.push({
      label: intl.formatMessage(messages.openGraphiQL),
      onSelect: openPlaygroundURL,
      testId: "graphiql-redirect",
      icon: <GraphqlIcon />,
    });

    if (customer && canEditCustomers) {
      items.push({
        label: intl.formatMessage(messages.deleteUser),
        onSelect: onDelete,
        testId: "delete-user",
        color: "critical1",
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    return items;
  }, [
    canEditCustomers,
    customer,
    extensionMenuItems,
    intl,
    onActivateToggle,
    onDelete,
    openPlaygroundURL,
  ]);

  if (!customer) {
    return (
      <CustomerDetailsPageLoading
        canEditCustomers={canEditCustomers}
        customerBackLink={customerBackLink}
        customerId={customerId}
        onShowMetadata={onShowMetadata}
      />
    );
  }

  const initialForm: CustomerDetailsPageFormData = {
    customerTypeId: customer.customerType?.id || "",
    email: customer.email || "",
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    note: customer.note || "",
  };
  const checkIfSaveIsDisabled = (data: CustomerDetailsPageFormData): boolean => {
    if (disabled || isReadOnly) {
      return true;
    }

    return !hasCustomerSaveComposition(
      buildCustomerSaveComposition({
        attributesDirty,
        data,
        initial: initialForm,
      }),
    );
  };
  const menuItemsForNav = disabled
    ? menuItems.map(item => ({ ...item, disabled: true }))
    : menuItems;

  return (
    <Form
      key={formIdentity}
      confirmLeave
      initial={initialForm}
      onSubmit={async formData => {
        const extras = await getSubmitDataRef.current();

        return onSubmit({ ...formData, ...extras });
      }}
      disabled={disabled}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ change, data, isSaveDisabled, submit, triggerChange }) => {
        const saveComposition = buildCustomerSaveComposition({
          attributesDirty,
          data,
          initial: initialForm,
        });

        return (
          <>
            <FormDirtyStateSync
              enabled
              isSaveDisabled={isSaveDisabled}
              triggerChange={triggerChange}
            />
            <CustomerTypeAndAttributes
              key={`${customer.id}:${attributeFormRevision}`}
              assignReferencesAttributeId={assignReferencesAttributeId}
              customer={customer}
              customerTypeId={data.customerTypeId}
              disabled={disabled || isReadOnly}
              errors={errors}
              fetchMoreReferenceCategories={fetchMoreReferenceCategories}
              fetchMoreReferenceCollections={fetchMoreReferenceCollections}
              fetchMoreReferencePages={fetchMoreReferencePages}
              fetchMoreReferenceProducts={fetchMoreReferenceProducts}
              fetchReferenceCategories={fetchReferenceCategories}
              fetchReferenceCollections={fetchReferenceCollections}
              fetchReferencePages={fetchReferencePages}
              fetchReferenceProducts={fetchReferenceProducts}
              getSubmitDataRef={getSubmitDataRef}
              initialConstraints={initialConstraints}
              onAssignReferencesClick={onAssignReferencesClick}
              onAttributesDirtyChange={setAttributesDirty}
              onCloseAssignReferences={onCloseAssignReferences}
              onFilterChange={onFilterChange}
              onTypeChange={type => {
                change({
                  target: {
                    name: "customerTypeId",
                    value: type?.id ?? "",
                  },
                });
              }}
              referenceCategories={referenceCategories}
              referenceCollections={referenceCollections}
              referencePages={referencePages}
              referenceProducts={referenceProducts}
              triggerChange={triggerChange}
            >
              {({ attributesCard }) => (
                <DetailPageLayout>
                  <TopNav
                    href={customerBackLink}
                    hrefIcon={<TopNavDestinationIcon.customers />}
                    hrefTitle={intl.formatMessage(topNavDestinationMessages.allCustomers)}
                    title={<CustomerDetailsTitle customer={customer} />}
                    actionsGap={3}
                  >
                    {canEditCustomers && (
                      <TopNav.MetadataButton
                        onClick={onShowMetadata}
                        disabled={disabled}
                        data-test-id="show-customer-metadata"
                        title={intl.formatMessage(messages.editCustomerMetadata)}
                      />
                    )}
                    {menuItemsForNav.length > 0 && (
                      <TopNav.Menu items={menuItemsForNav} dataTestId="menu" />
                    )}
                  </TopNav>
                  <DetailPageLayout.Content>
                    <DetailPageContent>
                      <CustomerOverview customer={customer} />
                      <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                        <CustomerOrders
                          orders={mapEdgesToItems(customer.orders)}
                          viewAllHref={orderListUrlWithCustomerEmail(customer.email)}
                        />
                      </RequirePermissions>
                      {attributesCard}
                    </DetailPageContent>
                  </DetailPageLayout.Content>
                  <DetailPageLayout.RightSidebar paddingTop={6} paddingX={6}>
                    <Box display="flex" flexDirection="column" gap={4}>
                      <CustomerInfo
                        data={data}
                        disabled={disabled || isReadOnly}
                        errors={errors}
                        onChange={change}
                      />
                      <CustomerAddresses
                        customer={customer}
                        disabled={disabled || isReadOnly}
                        manageAddressHref={customerAddressesUrl(customerId)}
                      />
                      <ExternalReferenceCard customer={customer} />
                      <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_GIFT_CARD]}>
                        <CustomerGiftCardsCard />
                      </RequirePermissions>
                    </Box>
                    {CUSTOMER_DETAILS_WIDGETS.length > 0 && customer.id && (
                      <>
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
                        <Savebar.Spacer />
                        <CustomerSaveCompositionHint composition={saveComposition} />
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
          </>
        );
      }}
    </Form>
  );
};

interface CustomerTypeAndAttributesProps {
  assignReferencesAttributeId?: string;
  children: (slots: { attributesCard: ReactNode }) => ReactNode;
  customer: NonNullable<CustomerDetailsQuery["user"]>;
  customerTypeId: string;
  disabled: boolean;
  errors: AccountErrorFragment[];
  fetchMoreReferenceCategories?: FetchMoreProps;
  fetchMoreReferenceCollections?: FetchMoreProps;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchReferenceCategories?: (data: string) => void;
  fetchReferenceCollections?: (data: string) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  getSubmitDataRef: MutableRefObject<() => Promise<CustomerDetailsAttributeSubmitData>>;
  initialConstraints?: InitialConstraints & InitialPageConstraints;
  onAssignReferencesClick?: (attribute: AttributeInput) => void;
  onAttributesDirtyChange: (dirty: boolean) => void;
  onCloseAssignReferences?: () => void;
  onFilterChange?: AssignAttributeValueDialogFilterChangeMap;
  onTypeChange: (type: { id: string; name: string } | null) => void;
  referenceCategories: ReferenceEntitiesSearch["categories"];
  referenceCollections: ReferenceEntitiesSearch["collections"];
  referencePages: ReferenceEntitiesSearch["pages"];
  referenceProducts: ReferenceEntitiesSearch["products"];
  triggerChange: () => void;
}

const CustomerTypeAndAttributes = ({
  assignReferencesAttributeId,
  children,
  customer,
  customerTypeId,
  disabled,
  errors,
  fetchMoreReferenceCategories,
  fetchMoreReferenceCollections,
  fetchMoreReferencePages,
  fetchMoreReferenceProducts,
  fetchReferenceCategories,
  fetchReferenceCollections,
  fetchReferencePages,
  fetchReferenceProducts,
  getSubmitDataRef,
  initialConstraints,
  onAssignReferencesClick,
  onAttributesDirtyChange,
  onCloseAssignReferences,
  onFilterChange,
  onTypeChange,
  referenceCategories,
  referenceCollections,
  referencePages,
  referenceProducts,
  triggerChange,
}: CustomerTypeAndAttributesProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const attributeForm = useCustomerDetailsAttributes({
    assignReferencesAttributeId,
    customer,
    fetchMoreReferenceCategories,
    fetchMoreReferenceCollections,
    fetchMoreReferencePages,
    fetchMoreReferenceProducts,
    fetchReferenceCategories,
    fetchReferenceCollections,
    fetchReferencePages,
    fetchReferenceProducts,
    referenceCategories,
    referenceCollections,
    referencePages,
    referenceProducts,
    triggerChange,
  });
  const [pickedType, setPickedType] = useState<{ id: string; name: string } | null>(null);
  const formErrors = getFormErrors(["customerType"], errors);

  useEffect(
    function syncSubmitDataRef() {
      getSubmitDataRef.current = attributeForm.getSubmitData;
    },
    [attributeForm.getSubmitData, getSubmitDataRef],
  );

  useEffect(
    function syncAttributesDirty() {
      onAttributesDirtyChange(attributeForm.isDirty);
    },
    [attributeForm.isDirty, onAttributesDirtyChange],
  );

  const selectedType =
    pickedType && pickedType.id === customerTypeId
      ? pickedType
      : customer.customerType
        ? { id: customer.customerType.id, name: customer.customerType.name }
        : null;

  const attributesCard = (
    <CustomerAttributesCard
      selectedType={selectedType}
      savedTypeId={customer.customerType?.id ?? null}
      disabled={disabled || attributeForm.typeAttributesLoading}
      error={
        formErrors.customerType ? getAccountErrorMessage(formErrors.customerType, intl) : undefined
      }
      onChange={type => {
        const previousType = selectedType;

        setPickedType(type);
        onTypeChange(type);
        void attributeForm.handleTypeChange(type.id).then(loaded => {
          if (loaded) {
            return;
          }

          setPickedType(previousType);
          onTypeChange(previousType);
          notify({
            status: "error",
            text: intl.formatMessage(commonMessages.somethingWentWrong),
          });
        });
      }}
    >
      {attributeForm.attributes.length > 0 ? (
        <Attributes
          unwrapped
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
          onReferencesAddClick={onAssignReferencesClick ?? noopAssignReferences}
          onReferencesRemove={attributeForm.handlers.selectAttributeReference}
          onReferencesReorder={attributeForm.handlers.onReferencesReorder}
          richTextGetters={attributeForm.attributeRichTextGetters}
        />
      ) : null}
    </CustomerAttributesCard>
  );
  const assignedAttribute = assignReferencesAttributeId
    ? attributeForm.attributes.find(({ id }) => id === assignReferencesAttributeId)
    : undefined;
  const assignedEntityType = assignReferencesAttributeId
    ? getReferenceAttributeEntityTypeFromAttribute(
        assignReferencesAttributeId,
        attributeForm.attributes,
      )
    : undefined;
  const canOpenAssignReferences =
    Boolean(assignReferencesAttributeId) &&
    Boolean(assignedAttribute) &&
    Boolean(assignedEntityType);

  const handleCloseAssignReferences = (): void => {
    onCloseAssignReferences?.();
  };
  const handleAssignReferences = (attributeValues: Container[]): void => {
    if (!assignReferencesAttributeId) {
      return;
    }

    handleContainerReferenceAssignment(
      assignReferencesAttributeId,
      attributeValues,
      attributeForm.attributes,
      {
        selectAttributeReference: attributeForm.handlers.selectAttributeReference,
        selectAttributeReferenceAdditionalData:
          attributeForm.handlers.selectAttributeReferenceAdditionalData,
      },
    );
    onCloseAssignReferences?.();
  };
  const handleFetchMoreReferences = (): void => {
    attributeForm.handlers.fetchMoreReferences?.onFetchMore();
  };

  return (
    <>
      {children({ attributesCard })}
      {canOpenAssignReferences && assignedAttribute && assignedEntityType ? (
        <AssignAttributeValueDialog
          entityType={assignedEntityType}
          attribute={assignedAttribute}
          confirmButtonState="default"
          products={(referenceProducts ?? []) as Products}
          pages={referencePages ?? []}
          collections={referenceCollections ?? []}
          categories={referenceCategories ?? []}
          hasMore={attributeForm.handlers.fetchMoreReferences?.hasMore ?? false}
          open={canOpenAssignReferences}
          onFetch={attributeForm.handlers.fetchReferences}
          onFetchMore={handleFetchMoreReferences}
          loading={attributeForm.handlers.fetchMoreReferences?.loading ?? false}
          onClose={handleCloseAssignReferences}
          onFilterChange={onFilterChange}
          initialConstraints={initialConstraints}
          onSubmit={handleAssignReferences}
        />
      ) : null}
    </>
  );
};

CustomerDetailsPage.displayName = "CustomerDetailsPage";
export default CustomerDetailsPage;
