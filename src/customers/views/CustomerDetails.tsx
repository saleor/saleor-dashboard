// @ts-strict-ignore
import { getAttributesAfterFileAttributesUpdate } from "@dashboard/attributes/utils/data";
import { handleUploadMultipleFiles } from "@dashboard/attributes/utils/handlers";
import { getReferenceTypeConstraints } from "@dashboard/components/AssignAttributeValueDialog/getReferenceTypeConstraints";
import { getReferenceWhereConstraints } from "@dashboard/components/AssignAttributeValueDialog/mergeReferenceTypeWhereConstraints";
import { useAssignAttributeValueDialogFilterChangeHandlers } from "@dashboard/components/AssignAttributeValueDialog/useAssignAttributeValueDialogFilterChangeHandlers";
import { type AttributeInput } from "@dashboard/components/Attributes/Attributes";
import NotFoundPage from "@dashboard/components/NotFoundPage/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useFileUploadMutation,
  useRemoveCustomerMutation,
  useUpdateCustomerMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import {
  useReferenceCategorySearch,
  useReferenceCollectionSearch,
  useReferencePageSearch,
  useReferenceProductSearch,
} from "@dashboard/searches/useReferenceSearch";
import { type FetchMoreProps } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { CustomerDeleteDialog } from "../components/CustomerDeleteDialog/CustomerDeleteDialog";
import CustomerDetailsPage, {
  type CustomerDetailsPageSubmitData,
} from "../components/CustomerDetailsPage/CustomerDetailsPage";
import { CustomerMetadataDialog } from "../components/CustomerMetadataDialog/CustomerMetadataDialog";
import { CustomerStatusChangeDialog } from "../components/CustomerStatusChangeDialog/CustomerStatusChangeDialog";
import { messages as customerTypeMessages } from "../components/CustomerTypeCard/messages";
import { useCustomerDetails } from "../hooks/useCustomerDetails";
import { CustomerDetailsProvider } from "../providers/CustomerDetailsProvider";
import { customerListUrl, customerUrl, type CustomerUrlQueryParams } from "../urls";
import {
  getAttributeInputFromCustomer,
  getCustomerUpdateAttributesInput,
} from "../utils/customerAttributes";

interface CustomerDetailsViewProps {
  id: string;
  params: CustomerUrlQueryParams;
}

const CustomerDetailsViewInner = ({ id, params }: CustomerDetailsViewProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const customerDetails = useCustomerDetails();
  const user = customerDetails?.customer?.user;
  const customerDetailsLoading = customerDetails?.loading;
  // Bumped after a type-change save so the attribute form remounts from the
  // refetched customer. Assigned values for the new type are hidden until
  // then, and useFormset will not pick them up on its own.
  const [attributeFormRevision, setAttributeFormRevision] = useState(0);

  const [removeCustomer, removeCustomerOpts] = useRemoveCustomerMutation({
    onCompleted: data => {
      if (data.customerDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "PXatmC",
            defaultMessage: "Customer Removed",
          }),
        });
        navigate(customerListUrl());
      }
    },
  });

  const [updateCustomer, updateCustomerOpts] = useUpdateCustomerMutation();
  const [uploadFile] = useFileUploadMutation({});
  const [openModal, closeModal] = createDialogActionHandlers(
    navigate,
    dialogParams => customerUrl(id, dialogParams),
    params,
  );
  const handleAssignAttributeReferenceClick = (attribute: AttributeInput): void =>
    openModal("assign-attribute-value", { id: attribute.id });
  const refAttr =
    params.action === "assign-attribute-value" && params.id
      ? user?.customerType?.attributes?.find(attribute => attribute.id === params.id)
      : undefined;
  const initialConstraints = useMemo(
    () => getReferenceTypeConstraints(refAttr?.referenceTypes),
    [refAttr?.referenceTypes],
  );
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useReferenceProductSearch(refAttr);
  const {
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = useReferencePageSearch(refAttr);
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useReferenceCollectionSearch(refAttr);
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useReferenceCategorySearch(refAttr);
  const fetchMoreReferencePages: FetchMoreProps = {
    hasMore: Boolean(searchPagesOpts.data?.search?.pageInfo?.hasNextPage),
    loading: searchPagesOpts.loading,
    onFetchMore: loadMorePages,
  };
  const fetchMoreReferenceProducts: FetchMoreProps = {
    hasMore: Boolean(searchProductsOpts.data?.search?.pageInfo?.hasNextPage),
    loading: searchProductsOpts.loading,
    onFetchMore: loadMoreProducts,
  };
  const fetchMoreReferenceCategories: FetchMoreProps = {
    hasMore: Boolean(searchCategoriesOpts.data?.search?.pageInfo?.hasNextPage),
    loading: searchCategoriesOpts.loading,
    onFetchMore: loadMoreCategories,
  };
  const fetchMoreReferenceCollections: FetchMoreProps = {
    hasMore: Boolean(searchCollectionsOpts.data?.search?.pageInfo?.hasNextPage),
    loading: searchCollectionsOpts.loading,
    onFetchMore: loadMoreCollections,
  };
  const onFilterChange = useAssignAttributeValueDialogFilterChangeHandlers({
    refetchProducts: searchProductsOpts.refetch,
    refetchPages: searchPagesOpts.refetch,
    refetchCategories: searchCategoriesOpts.refetch,
    refetchCollections: searchCollectionsOpts.refetch,
    referenceWhereConstraints: getReferenceWhereConstraints(initialConstraints),
  });

  // Each `updateCustomer` call site emits its own toast so the message can
  // describe what the user just did (form save vs. activate vs. deactivate).
  const notifyCustomerUpdate = (text: string) =>
    notify({
      status: "success",
      text,
    });

  if (user === null) {
    return <NotFoundPage backHref={customerListUrl()} />;
  }

  const handleSubmit = async (data: CustomerDetailsPageSubmitData) => {
    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );
    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      data.attributesWithNewFileValue,
      uploadFilesResult,
    );
    const typeChanged = Boolean(
      data.customerTypeId && data.customerTypeId !== user?.customerType?.id,
    );
    const attributes = getCustomerUpdateAttributesInput({
      attributes: data.attributes,
      prevAttributes: getAttributeInputFromCustomer(user),
      typeChanged,
      updatedFileAttributes,
    });
    const result = await updateCustomer({
      variables: {
        id,
        input: {
          ...(attributes ? { attributes } : {}),
          customerType: data.customerTypeId || undefined,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          note: data.note,
        },
      },
    });

    if (result.data?.customerUpdate.errors.length === 0) {
      if (typeChanged) {
        await customerDetails.refetch();
        setAttributeFormRevision(revision => revision + 1);
        notify({
          status: "success",
          title: intl.formatMessage(customerTypeMessages.typeChanged),
          text: intl.formatMessage(customerTypeMessages.typeChangedDescription),
        });
      } else {
        notifyCustomerUpdate(
          intl.formatMessage({ id: "PeEood", defaultMessage: "Customer updated" }),
        );
      }
    }

    return extractMutationErrors(Promise.resolve(result));
  };

  // Activate / deactivate is gated behind a confirmation dialog, mirroring the
  // Delete flow: the cogs menu navigates to ?action=activate|deactivate, the
  // dialog confirms, and the mutation fires on confirm.
  const handleActivateToggle = () => {
    if (!user) {
      return;
    }

    navigate(
      customerUrl(id, {
        action: user.isActive ? "deactivate" : "activate",
      }),
    );
  };

  const closeDialog = () => navigate(customerUrl(id), { replace: true });
  const customerEmail = <strong>{getStringOrPlaceholder(user?.email)}</strong>;
  const isStatusDialogOpen = params.action === "activate" || params.action === "deactivate";

  // Run the mutation, then emit an action-specific toast and close the dialog
  // on success. The confirm button still transitions through its loading state
  // because we await the mutation result.
  const handleActivateConfirm = async () => {
    const result = await updateCustomer({
      variables: {
        id,
        input: { isActive: true },
      },
    });

    if (result.data?.customerUpdate.errors.length === 0) {
      notifyCustomerUpdate(
        intl.formatMessage({
          defaultMessage: "Customer activated",
          description: "success toast after activating a customer",
          id: "6jt3RB",
        }),
      );
      closeDialog();
    }
  };

  const handleDeactivateConfirm = async () => {
    const result = await updateCustomer({
      variables: {
        id,
        input: { isActive: false },
      },
    });

    if (result.data?.customerUpdate.errors.length === 0) {
      notifyCustomerUpdate(
        intl.formatMessage({
          defaultMessage: "Customer deactivated",
          description: "success toast after deactivating a customer",
          id: "SPzIC5",
        }),
      );
      closeDialog();
    }
  };

  return (
    <>
      <WindowTitle title={user?.email} />
      <CustomerDetailsPage
        attributeFormRevision={attributeFormRevision}
        assignReferencesAttributeId={
          params.action === "assign-attribute-value" ? params.id : undefined
        }
        customerId={id}
        customer={user}
        disabled={
          customerDetailsLoading || updateCustomerOpts.loading || removeCustomerOpts.loading
        }
        errors={updateCustomerOpts.data?.customerUpdate.errors || []}
        fetchMoreReferenceCategories={fetchMoreReferenceCategories}
        fetchMoreReferenceCollections={fetchMoreReferenceCollections}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchReferenceCategories={searchCategories}
        fetchReferenceCollections={searchCollections}
        fetchReferencePages={searchPages}
        fetchReferenceProducts={searchProducts}
        initialConstraints={initialConstraints}
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        onCloseAssignReferences={closeModal}
        onFilterChange={onFilterChange}
        saveButtonBar={updateCustomerOpts.status}
        onSubmit={handleSubmit}
        onActivateToggle={handleActivateToggle}
        onShowMetadata={() =>
          navigate(
            customerUrl(id, {
              action: "view-metadata",
            }),
          )
        }
        onDelete={() =>
          navigate(
            customerUrl(id, {
              action: "remove",
            }),
          )
        }
        referenceCategories={mapEdgesToItems(searchCategoriesOpts?.data?.search) || []}
        referenceCollections={mapEdgesToItems(searchCollectionsOpts?.data?.search) || []}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
      />
      <CustomerMetadataDialog
        open={params.action === "view-metadata"}
        onClose={closeDialog}
        customer={user}
      />
      <CustomerDeleteDialog
        confirmButtonState={removeCustomerOpts.status}
        email={customerEmail}
        onClose={closeDialog}
        onConfirm={() =>
          removeCustomer({
            variables: {
              id,
            },
          })
        }
        open={params.action === "remove"}
      />
      <CustomerStatusChangeDialog
        confirmButtonState={isStatusDialogOpen ? updateCustomerOpts.status : "default"}
        email={customerEmail}
        onClose={closeDialog}
        onConfirm={params.action === "deactivate" ? handleDeactivateConfirm : handleActivateConfirm}
        open={isStatusDialogOpen}
        variant={params.action === "deactivate" ? "deactivate" : "activate"}
      />
    </>
  );
};

const CustomerDetailsView = ({ id, params }: CustomerDetailsViewProps) => (
  <CustomerDetailsProvider key={id} id={id}>
    <CustomerDetailsViewInner id={id} params={params} />
  </CustomerDetailsProvider>
);

export default CustomerDetailsView;
