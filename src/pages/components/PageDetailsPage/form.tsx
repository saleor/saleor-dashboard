// @ts-strict-ignore
import {
  getAttributesDisplayData,
  getRichTextAttributesFromMap,
  getRichTextDataFromAttributes,
  mergeAttributes,
  RichTextProps,
} from "@dashboard/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeReferenceMetadataHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler,
} from "@dashboard/attributes/utils/handlers";
import { AttributeInput } from "@dashboard/components/Attributes";
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { MetadataFormData } from "@dashboard/components/Metadata";
import {
  PageDetailsFragment,
  PageErrorWithAttributesFragment,
  SearchPagesQuery,
  SearchPageTypesQuery,
  SearchProductsQuery,
} from "@dashboard/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  SubmitPromise,
} from "@dashboard/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData,
  FormsetMetadataChange,
} from "@dashboard/hooks/useFormset";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import {
  getAttributeInputFromPage,
  getAttributeInputFromPageType,
} from "@dashboard/pages/utils/data";
import { createPageTypeSelectHandler } from "@dashboard/pages/utils/handlers";
import { validatePageCreateData } from "@dashboard/pages/utils/validation";
import { AttributeValuesMetadata } from "@dashboard/products/utils/data";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@dashboard/types";
import getPublicationData from "@dashboard/utils/data/getPublicationData";
import { mapMetadataItemToInput } from "@dashboard/utils/maps";
import getMetadata from "@dashboard/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@dashboard/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@dashboard/utils/richText/context";
import { useMultipleRichText } from "@dashboard/utils/richText/useMultipleRichText";
import useRichText from "@dashboard/utils/richText/useRichText";
import { OutputData } from "@editorjs/editorjs";
import { useEffect, useState } from "react";
import * as React from "react";

export interface PageFormData extends MetadataFormData {
  isPublished: boolean;
  publishedAt: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  title: string;
  pageType: PageDetailsFragment["pageType"];
}
export interface PageData extends PageFormData {
  attributes: AttributeInput[];
  content: OutputData;
}

export interface PageSubmitData extends PageFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  content: OutputData;
}

export interface PageUpdateHandlers {
  changeMetadata: FormChange;
  selectPageType: FormChange;
  selectAttribute: FormsetChange<string>;
  selectAttributeMulti: FormsetChange<string>;
  selectAttributeReference: FormsetChange<string[]>;
  selectAttributeReferenceMetadata: FormsetMetadataChange<AttributeValuesMetadata[]>;
  selectAttributeFile: FormsetChange<File>;
  reorderAttributeValue: FormsetChange<ReorderEvent>;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
}

export interface UsePageUpdateFormOutput
  extends CommonUseFormResultWithHandlers<PageData, PageUpdateHandlers>,
    RichTextProps {
  valid: boolean;
  validationErrors: PageErrorWithAttributesFragment[];
}

export type UsePageUpdateFormRenderProps = Omit<UsePageUpdateFormOutput, "richText">;

export interface UsePageFormOpts {
  pageTypes?: RelayToFlat<SearchPageTypesQuery["search"]>;
  referencePages: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts: RelayToFlat<SearchProductsQuery["search"]>;
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
  selectedPageType?: PageDetailsFragment["pageType"];
  onSelectPageType: (pageTypeId: string) => void;
}

export interface PageFormProps extends UsePageFormOpts {
  children: (props: UsePageUpdateFormRenderProps) => React.ReactNode;
  page: PageDetailsFragment;
  onSubmit: (data: PageData) => SubmitPromise;
  disabled: boolean;
}

const getInitialFormData = (pageExists: boolean, page?: PageDetailsFragment): PageFormData => ({
  isPublished: pageExists ? page?.isPublished : true,
  metadata: page?.metadata?.map(mapMetadataItemToInput) || [],
  pageType: null,
  privateMetadata: page?.privateMetadata?.map(mapMetadataItemToInput) || [],
  publishedAt: pageExists ? page?.publishedAt : "",
  seoDescription: page?.seoDescription || "",
  seoTitle: page?.seoTitle || "",
  slug: page?.slug || "",
  title: page?.title || "",
});

function usePageForm(
  page: PageDetailsFragment,
  onSubmit: (data: PageData) => SubmitPromise,
  disabled: boolean,
  opts: UsePageFormOpts,
): UsePageUpdateFormOutput {
  const pageExists = page !== null;
  const {
    handleChange,
    triggerChange,
    data: formData,
    formId,
  } = useForm(getInitialFormData(pageExists, page), undefined, {
    confirmLeave: true,
  });
  const [validationErrors, setValidationErrors] = useState<PageErrorWithAttributesFragment[]>([]);
  const attributes = useFormset(
    pageExists
      ? getAttributeInputFromPage(page)
      : opts.selectedPageType
        ? getAttributeInputFromPageType(opts.selectedPageType)
        : [],
  );
  const { getters: attributeRichTextGetters, getValues: getAttributeRichTextValues } =
    useMultipleRichText({
      initial: getRichTextDataFromAttributes(attributes.data),
      triggerChange,
    });
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const { setExitDialogSubmitRef, setIsSubmitDisabled, setIsDirty } = useExitFormDialog({
    formId,
  });
  const richText = useRichText({
    initial: pageExists ? page?.content : null,
    loading: pageExists ? !page : false,
    triggerChange,
  });
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
  } = useMetadataChangeTrigger();
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handlePageTypeSelect = createPageTypeSelectHandler(opts.onSelectPageType, triggerChange);
  const handleAttributeChange = createAttributeChangeHandler(attributes.change, triggerChange);
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange,
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes.change,
    triggerChange,
  );
  const handleAttributeMetadataChange = createAttributeReferenceMetadataHandler(
    attributes.setMetadata,
    triggerChange,
  );
  const handleFetchReferences = createFetchReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchReferencePages,
    opts.fetchReferenceProducts,
  );
  const handleFetchMoreReferences = createFetchMoreReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchMoreReferencePages,
    opts.fetchMoreReferenceProducts,
  );
  const handleAttributeFileChange = createAttributeFileChangeHandler(
    attributes.change,
    attributesWithNewFileValue.data,
    attributesWithNewFileValue.add,
    attributesWithNewFileValue.change,
    triggerChange,
  );
  const handleAttributeValueReorder = createAttributeValueReorderHandler(
    attributes.change,
    attributes.data,
    triggerChange,
  );
  const data: PageData = {
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts,
    ),
    content: null,
    pageType: pageExists ? page?.pageType : opts.selectedPageType,
  };
  const getSubmitData = async (): Promise<PageSubmitData> => ({
    ...data,
    ...getMetadata(formData, isMetadataModified, isPrivateMetadataModified),
    ...getPublicationData(formData),
    content: await richText.getValue(),
    attributes: mergeAttributes(
      attributes.data,
      getRichTextAttributesFromMap(attributes.data, await getAttributeRichTextValues()),
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
  });
  const handleSubmit = async (data: PageData) => {
    let errors = validatePageCreateData(data);

    setValidationErrors(errors);

    if (errors.length) {
      return errors;
    }

    errors = await onSubmit(data);

    if (!errors?.length && pageExists) {
      attributesWithNewFileValue.set([]);
    }

    return errors;
  };
  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
  });
  const submit = async () => {
    const errors = await handleFormSubmit(await getSubmitData());

    if (errors.length) {
      setIsSubmitDisabled(isSaveDisabled);
      setIsDirty(true);
    }

    return errors;
  };

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const valid = pageExists || !!opts.selectedPageType;
  const isSaveDisabled = disabled || !valid;

  useEffect(() => {
    setIsSubmitDisabled(isSaveDisabled);

    if (!pageExists) {
      setIsDirty(true);
    }
  }, [isSaveDisabled]);

  return {
    change: handleChange,
    data,
    validationErrors,
    valid,
    handlers: {
      changeMetadata,
      fetchMoreReferences: handleFetchMoreReferences,
      fetchReferences: handleFetchReferences,
      reorderAttributeValue: handleAttributeValueReorder,
      selectAttribute: handleAttributeChange,
      selectAttributeFile: handleAttributeFileChange,
      selectAttributeMulti: handleAttributeMultiChange,
      selectAttributeReference: handleAttributeReferenceChange,
      selectAttributeReferenceMetadata: handleAttributeMetadataChange,
      selectPageType: handlePageTypeSelect,
    },
    submit,
    isSaveDisabled,
    richText,
    attributeRichTextGetters,
  };
}

const PageForm = ({ children, page, onSubmit, disabled, ...rest }: PageFormProps) => {
  const { richText, ...props } = usePageForm(page, onSubmit, disabled, rest);

  return (
    <form onSubmit={props.submit}>
      <RichTextContext.Provider value={richText}>{children(props)}</RichTextContext.Provider>
    </form>
  );
};

PageForm.displayName = "PageForm";
export default PageForm;
