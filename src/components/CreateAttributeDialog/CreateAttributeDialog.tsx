import { AttributeCreateFormContent } from "@dashboard/attributes/components/AttributeCreateFormContent/AttributeCreateFormContent";
import { type AttributePageFormData } from "@dashboard/attributes/components/AttributePage";
import { useAttributeCreateValues } from "@dashboard/attributes/hooks/useAttributeCreateValues/useAttributeCreateValues";
import { getAttributePageInitialForm } from "@dashboard/attributes/utils/attributePageForm";
import {
  ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES,
  type AttributeValueEditDialogFormData,
} from "@dashboard/attributes/utils/data";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModelTypeDisplay } from "@dashboard/components/ModelType/ModelType";
import { ProductTypeDisplay } from "@dashboard/components/ProductType/ProductType";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeEntityTypeEnum,
  type AttributeErrorFragment,
  AttributeTypeEnum,
} from "@dashboard/graphql";
import { type CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { type ChangeEvent, type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import usePageTypeSearch from "@dashboard/searches/usePageTypeSearch";
import useProductTypeSearch from "@dashboard/searches/useProductTypeSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button } from "@saleor/macaw-ui-next";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import slugify from "slugify";

import { messages } from "./messages";

export interface AttributeCreateSubmitData {
  formData: AttributePageFormData;
  values: AttributeValueEditDialogFormData[];
}

interface CreateAttributeDialogProps {
  attributeType: AttributeTypeEnum;
  confirmButtonState: ConfirmButtonTransitionState;
  contextName?: string;
  disabled?: boolean;
  errors: AttributeErrorFragment[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AttributeCreateSubmitData) => SubmitPromise<AttributeErrorFragment[]>;
}

export const CreateAttributeDialog = ({
  attributeType,
  confirmButtonState,
  contextName,
  disabled = false,
  errors: apiErrors,
  open,
  onClose,
  onSubmit,
}: CreateAttributeDialogProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitErrors, setSubmitErrors] = useState<AttributeErrorFragment[]>([]);
  const initialForm = useMemo(
    () => getAttributePageInitialForm(null, attributeType),
    [attributeType],
  );
  const {
    deleteValueById,
    handleValueCreate,
    handleValueReorder,
    pageInfo,
    pageValues,
    loadNextPage,
    loadPreviousPage,
    resetValues,
    settings,
    updateListSettings,
    valueErrors,
    values,
  } = useAttributeCreateValues();
  const productRefSearch = useProductTypeSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });
  const pageRefSearch = usePageTypeSearch({ variables: DEFAULT_INITIAL_SEARCH_DATA });

  const resetDialog = useCallback(() => {
    setStep(1);
    resetValues();
    setSubmitErrors([]);
  }, [resetValues]);

  useModalDialogOpen(open, {
    onClose: resetDialog,
  });

  const handleSubmit = async (data: AttributePageFormData) => {
    const errors = await onSubmit({
      formData: {
        ...data,
        slug: data.slug || slugify(data.name).toLowerCase(),
        type: attributeType,
      },
      values,
    });

    setSubmitErrors(errors ?? []);

    return errors;
  };

  const displayedErrors = submitErrors.length > 0 ? submitErrors : apiErrors;

  const valueEdges = pageValues.map((value, valueIndex) => ({
    __typename: "AttributeValue" as const,
    file: value?.fileUrl
      ? {
          url: value.fileUrl,
          contentType: value.contentType ?? "",
          __typename: "File" as const,
        }
      : null,
    id: valueIndex.toString(),
    reference: null,
    slug: slugify(value.name).toLowerCase(),
    sortOrder: valueIndex,
    value: value.value ?? null,
    plainText: null,
    richText: null,
    boolean: null,
    date: null,
    dateTime: null,
    name: value.name,
  }));

  const contextBadgeLabel = contextName ? (
    attributeType === AttributeTypeEnum.PAGE_TYPE ? (
      <ModelTypeDisplay modelType={{ name: contextName }} />
    ) : (
      <ProductTypeDisplay productType={{ name: contextName }} />
    )
  ) : undefined;
  const isProductTypeAttribute = attributeType === AttributeTypeEnum.PRODUCT_TYPE;

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <Form initial={initialForm} onSubmit={handleSubmit} disabled={disabled}>
          {({ change, clearErrors, data, errors, set, setError, submit, triggerChange }) => {
            const activeRefSearch =
              data.entityType === AttributeEntityTypeEnum.PAGE ? pageRefSearch : productRefSearch;
            const referenceTypes = mapEdgesToItems<{ id: string; name: string }>(
              activeRefSearch.result.data?.search,
            );
            const fetchMoreReferenceTypes = getSearchFetchMoreProps(
              activeRefSearch.result as CommonSearchOpts,
              activeRefSearch.loadMore,
            );
            const referenceTypeOptions = (referenceTypes ?? []).map(type => ({
              label: type.name,
              value: type.id,
            }));
            const handleEntityTypeChange = (event: ChangeEvent) => {
              if (event.target?.name === "entityType") {
                set({ referenceTypes: [] });
                triggerChange();
              }

              change(event);
            };
            const canProceedToStepTwo = data.name.trim().length > 0;
            const requiresValues = ATTRIBUTE_TYPES_WITH_DEDICATED_VALUES.includes(data.inputType);
            // Reference types are optional in the API — omitting them allows all items of the entity type.
            const canSubmit = !requiresValues || values.length > 0;
            const handleBack = () => {
              if (step === 2) {
                setStep(1);
              } else {
                onClose();
              }
            };

            return (
              <>
                <DashboardModal.Content size="sm" data-test-id="create-attribute-dialog">
                  <DashboardModal.ContextHeader
                    contextLabel={contextBadgeLabel}
                    description={
                      <FormattedMessage
                        {...(step === 1
                          ? isProductTypeAttribute
                            ? messages.introHintProduct
                            : messages.introHint
                          : isProductTypeAttribute
                            ? messages.stepTwoIntroProduct
                            : messages.stepTwoIntro)}
                      />
                    }
                    steps={{
                      current: step,
                      items: [
                        { label: <FormattedMessage {...messages.stepGeneral} /> },
                        { label: <FormattedMessage {...messages.stepAttributeValues} /> },
                      ],
                    }}
                  >
                    <FormattedMessage {...messages.title} />
                  </DashboardModal.ContextHeader>

                  <DashboardModal.Body>
                    <DashboardModal.Inset>
                      <AttributeCreateFormContent
                        apiErrors={displayedErrors}
                        change={change}
                        clearErrors={clearErrors}
                        data={data}
                        disabled={disabled}
                        errors={errors}
                        inputType={data.inputType}
                        fetchMoreReferenceTypes={fetchMoreReferenceTypes}
                        fetchReferenceTypes={activeRefSearch.search}
                        referenceTypeOptions={referenceTypeOptions}
                        referenceTypesLoading={Boolean(fetchMoreReferenceTypes?.loading)}
                        onEntityTypeChange={handleEntityTypeChange}
                        onInlineValueAdd={handleValueCreate}
                        onNextPage={loadNextPage}
                        onPreviousPage={loadPreviousPage}
                        onUpdateListSettings={updateListSettings}
                        onValueDelete={deleteValueById}
                        onValueReorder={handleValueReorder}
                        pageInfo={pageInfo}
                        set={set}
                        setError={setError}
                        settings={settings}
                        step={step}
                        triggerChange={triggerChange}
                        valueAddError={valueErrors[0] ?? null}
                        values={valueEdges}
                      />
                    </DashboardModal.Inset>
                  </DashboardModal.Body>

                  <DashboardModal.Actions>
                    <BackButton onClick={handleBack} />
                    {step === 1 ? (
                      <Button
                        variant="primary"
                        disabled={!canProceedToStepTwo || disabled}
                        onClick={() => setStep(2)}
                        data-test-id="create-attribute-next-button"
                      >
                        <FormattedMessage {...messages.nextButton} />
                      </Button>
                    ) : (
                      <ConfirmButton
                        transitionState={confirmButtonState}
                        type="submit"
                        disabled={!canSubmit || disabled}
                        onClick={submit}
                        data-test-id="create-and-assign-attribute-button"
                      >
                        <FormattedMessage {...messages.createAndAssignButton} />
                      </ConfirmButton>
                    )}
                  </DashboardModal.Actions>
                </DashboardModal.Content>
              </>
            );
          }}
        </Form>
      ) : null}
    </DashboardModal>
  );
};
