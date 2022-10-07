import { OutputData } from "@editorjs/editorjs";
import {
  getAttributesDisplayData,
  getRichTextAttributesFromMap,
  getRichTextDataFromAttributes,
  mergeAttributes,
  RichTextProps,
} from "@saleor/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler,
} from "@saleor/attributes/utils/handlers";
import { AttributeInput } from "@saleor/components/Attributes";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import {
  PageDetailsFragment,
  PageErrorWithAttributesFragment,
  SearchPagesQuery,
  SearchPageTypesQuery,
  SearchProductsQuery,
} from "@saleor/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  SubmitPromise,
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData,
} from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import {
  getAttributeInputFromPage,
  getAttributeInputFromPageType,
} from "@saleor/pages/utils/data";
import { createPageTypeSelectHandler } from "@saleor/pages/utils/handlers";
import { validatePageCreateData } from "@saleor/pages/utils/validation";
import { FetchMoreProps, RelayToFlat, ReorderEvent } from "@saleor/types";
import getPublicationData from "@saleor/utils/data/getPublicationData";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { RichTextContext } from "@saleor/utils/richText/context";
import { useMultipleRichText } from "@saleor/utils/richText/useMultipleRichText";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect, useState } from "react";

export interface PageFormData extends MetadataFormData {
  isPublished: boolean;
  publicationDate: string;
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

export type UsePageUpdateFormRenderProps = Omit<
  UsePageUpdateFormOutput,
  "richText"
>;

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

const getInitialFormData = (
  pageExists: boolean,
  page?: PageDetailsFragment,
): PageFormData => ({
  isPublished: pageExists ? page?.isPublished : true,
  metadata: page?.metadata?.map(mapMetadataItemToInput) || [],
  pageType: null,
  privateMetadata: page?.privateMetadata?.map(mapMetadataItemToInput) || [],
  publicationDate: pageExists ? page?.publicationDate : "",
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

  const { handleChange, triggerChange, data: formData, formId } = useForm(
    getInitialFormData(pageExists, page),
    undefined,
    {
      confirmLeave: true,
    },
  );
  const [validationErrors, setValidationErrors] = useState<
    PageErrorWithAttributesFragment[]
  >([]);

  const attributes = useFormset(
    pageExists
      ? getAttributeInputFromPage(page)
      : opts.selectedPageType
      ? getAttributeInputFromPageType(opts.selectedPageType)
      : [],
  );

  const {
    getters: attributeRichTextGetters,
    getValues: getAttributeRichTextValues,
  } = useMultipleRichText({
    initial: getRichTextDataFromAttributes(attributes.data),
    triggerChange,
  });
  const attributesWithNewFileValue = useFormset<null, File>([]);

  const {
    setExitDialogSubmitRef,
    setIsSubmitDisabled,
    setIsDirty,
  } = useExitFormDialog({
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
  const handlePageTypeSelect = createPageTypeSelectHandler(
    opts.onSelectPageType,
    triggerChange,
  );
  const handleAttributeChange = createAttributeChangeHandler(
    attributes.change,
    triggerChange,
  );
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange,
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes.change,
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
      getRichTextAttributesFromMap(
        attributes.data,
        await getAttributeRichTextValues(),
      ),
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
      selectPageType: handlePageTypeSelect,
    },
    submit,
    isSaveDisabled,
    richText,
    attributeRichTextGetters,
  };
}

const PageForm: React.FC<PageFormProps> = ({
  children,
  page,
  onSubmit,
  disabled,
  ...rest
}) => {
  const { richText, ...props } = usePageForm(page, onSubmit, disabled, rest);

  return (
    <form onSubmit={props.submit}>
      <RichTextContext.Provider value={richText}>
        {children(props)}
      </RichTextContext.Provider>
    </form>
  );
};

PageForm.displayName = "PageForm";
export default PageForm;
