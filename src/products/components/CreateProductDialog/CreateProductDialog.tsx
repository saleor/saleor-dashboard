import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type ProductErrorWithAttributesFragment } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { type FetchMoreProps } from "@dashboard/types";
import { Box, Button, DynamicCombobox, Input, type Option, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface ProductTypeChoice extends Option {
  hasVariants: boolean;
}

export interface CreateProductFormData {
  name: string;
  productTypeId: string;
  hasVariants: boolean;
}

interface CreateProductDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  disabled?: boolean;
  errors: ProductErrorWithAttributesFragment[];
  productTypes?: ProductTypeChoice[];
  fetchProductTypes: (data: string) => void;
  fetchMoreProductTypes: FetchMoreProps;
  initialProductType?: ProductTypeChoice;
  onClose: () => void;
  onCreateProductType: () => void;
  onSubmit: (data: CreateProductFormData) => SubmitPromise<ProductErrorWithAttributesFragment[]>;
}

interface CreateProductFields {
  name: string;
}

export const CreateProductDialog = ({
  open,
  confirmButtonState,
  disabled = false,
  errors: apiErrors,
  productTypes,
  fetchProductTypes,
  fetchMoreProductTypes,
  initialProductType,
  onClose,
  onCreateProductType,
  onSubmit,
}: CreateProductDialogProps): JSX.Element => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<ProductTypeChoice | null>(null);
  const [query, setQuery] = useState("");
  const [submitErrors, setSubmitErrors] = useState<ProductErrorWithAttributesFragment[]>([]);
  const [showApiErrors, setShowApiErrors] = useState(false);
  const [prevOpen, setPrevOpen] = useState<boolean | null>(null);
  // Search results reuse `productTypes`. Once we've seen types, keep the create
  // form even if a later search (or a cached miss on reopen) returns none.
  const [seenTypes, setSeenTypes] = useState(false);

  const debouncedFetchProductTypes = useDebounce(fetchProductTypes, 500);

  if (prevOpen !== open) {
    setPrevOpen(open);
    setSelectedOption(open ? (initialProductType ?? null) : null);
    setQuery("");
    setSubmitErrors([]);
    setShowApiErrors(false);
  } else if (open && initialProductType && !selectedOption) {
    setSelectedOption(initialProductType);
  }

  if (!seenTypes && ((productTypes?.length ?? 0) > 0 || initialProductType)) {
    setSeenTypes(true);
  }

  useModalDialogOpen(open, {
    onOpen: () => fetchProductTypes(""),
  });

  const typeOptions: ProductTypeChoice[] = (() => {
    const options = productTypes ?? [];

    if (selectedOption && !options.some(type => type.value === selectedOption.value)) {
      return [selectedOption, ...options];
    }

    return options;
  })();
  const isLoading = Boolean(fetchMoreProductTypes?.loading);
  const showEmptyShopState =
    !isLoading && !seenTypes && !query.trim() && (productTypes?.length ?? 0) === 0;

  const handleScrollEnd = () => {
    if (fetchMoreProductTypes?.hasMore) {
      fetchMoreProductTypes?.onFetchMore();
    }
  };

  const handleCreateProductType = () => {
    onClose();
    onCreateProductType();
  };

  const fieldErrors = [...(showApiErrors ? apiErrors : []), ...submitErrors]
    .map(error => error.message)
    .filter(Boolean)
    .join(" ");

  const initialForm: CreateProductFields = {
    name: "",
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open && showEmptyShopState ? (
        <DashboardModal.Content size="xs" data-test-id="create-product-dialog">
          <DashboardModal.Header>
            <FormattedMessage {...messages.createProductTypeTitle} />
          </DashboardModal.Header>
          <DashboardModal.Body>
            <DashboardModal.Inset>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                data-test-id="product-type-picker-empty"
              >
                <Text size={3} fontWeight="medium">
                  <FormattedMessage {...messages.emptyTitle} />
                </Text>
                <Text size={2} color="default2">
                  <FormattedMessage {...messages.emptyDescription} />
                </Text>
              </Box>
            </DashboardModal.Inset>
          </DashboardModal.Body>
          <DashboardModal.Actions>
            <BackButton onClick={onClose} />
            <Button
              variant="primary"
              data-test-id="create-product-type"
              onClick={handleCreateProductType}
            >
              <FormattedMessage {...messages.createProductType} />
            </Button>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      ) : null}
      {open && !showEmptyShopState ? (
        <Form
          initial={initialForm}
          onSubmit={async data => {
            if (!selectedOption) {
              return [];
            }

            setShowApiErrors(true);

            const errors = await onSubmit({
              name: data.name.trim(),
              productTypeId: selectedOption.value,
              hasVariants: selectedOption.hasVariants,
            });

            setSubmitErrors(errors ?? []);

            return errors;
          }}
          disabled={disabled}
        >
          {({ change, data, submit }) => (
            <DashboardModal.Content size="sm" data-test-id="create-product-dialog">
              <DashboardModal.ContextHeader
                description={<FormattedMessage {...messages.description} />}
              >
                <FormattedMessage {...messages.title} />
              </DashboardModal.ContextHeader>

              <DashboardModal.Body>
                <DashboardModal.Inset>
                  <Box display="flex" flexDirection="column" gap={4}>
                    <Input
                      name="name"
                      label={intl.formatMessage(commonMessages.name)}
                      value={data.name}
                      onChange={change}
                      disabled={disabled}
                      data-test-id="product-name-input"
                      autoFocus
                    />
                    <DynamicCombobox
                      data-test-id="dialog-product-type"
                      label={intl.formatMessage(messages.productType)}
                      options={typeOptions}
                      name="productType"
                      size="small"
                      value={selectedOption}
                      onChange={option => setSelectedOption(option as ProductTypeChoice | null)}
                      onInputValueChange={value => {
                        setQuery(value);
                        debouncedFetchProductTypes(value);
                      }}
                      onFocus={() => fetchProductTypes("")}
                      onScrollEnd={handleScrollEnd}
                      loading={fetchMoreProductTypes?.loading}
                    />
                    {fieldErrors ? (
                      <Text size={2} color="critical1" as="p">
                        {fieldErrors}
                      </Text>
                    ) : null}
                  </Box>
                </DashboardModal.Inset>
              </DashboardModal.Body>

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  onClick={submit}
                  disabled={disabled || !data.name.trim() || !selectedOption}
                  data-test-id="submit"
                >
                  <FormattedMessage {...buttonMessages.create} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          )}
        </Form>
      ) : null}
    </DashboardModal>
  );
};
