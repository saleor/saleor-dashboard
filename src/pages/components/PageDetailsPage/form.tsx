import { OutputData } from "@editorjs/editorjs";
import { getAttributesDisplayData } from "@saleor/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler
} from "@saleor/attributes/utils/handlers";
import { AttributeInput } from "@saleor/components/Attributes";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  SubmitPromise
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import useHandleFormSubmit from "@saleor/hooks/useHandleFormSubmit";
import {
  PageDetails_page,
  PageDetails_page_pageType
} from "@saleor/pages/types/PageDetails";
import { PageType_pageType } from "@saleor/pages/types/PageType";
import {
  getAttributeInputFromPage,
  getAttributeInputFromPageType
} from "@saleor/pages/utils/data";
import { createPageTypeSelectHandler } from "@saleor/pages/utils/handlers";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { SearchPageTypes_search_edges_node } from "@saleor/searches/types/SearchPageTypes";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import getPublicationData from "@saleor/utils/data/getPublicationData";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect } from "react";

export interface PageFormData extends MetadataFormData {
  isPublished: boolean;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  title: string;
  pageType: PageType_pageType | PageDetails_page_pageType;
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
  changeContent: RichTextEditorChange;
  selectPageType: FormChange;
  selectAttribute: FormsetChange<string>;
  selectAttributeMulti: FormsetChange<string>;
  selectAttributeReference: FormsetChange<string[]>;
  selectAttributeFile: FormsetChange<File>;
  reorderAttributeValue: FormsetChange<ReorderEvent>;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
}

export interface UsePageUpdateFormResult
  extends CommonUseFormResultWithHandlers<PageData, PageUpdateHandlers> {
  valid: boolean;
}

export interface UsePageFormOpts {
  pageTypes?: SearchPageTypes_search_edges_node[];
  referencePages: SearchPages_search_edges_node[];
  referenceProducts: SearchProducts_search_edges_node[];
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
  selectedPageType?: PageType_pageType;
  onSelectPageType: (pageTypeId: string) => void;
}

export interface PageFormProps extends UsePageFormOpts {
  children: (props: UsePageUpdateFormResult) => React.ReactNode;
  page: PageDetails_page;
  onSubmit: (data: PageData) => SubmitPromise;
}

const getInitialFormData = (page?: PageDetails_page): PageFormData => ({
  isPublished: page?.isPublished,
  metadata: page?.metadata?.map(mapMetadataItemToInput) || [],
  pageType: null,
  privateMetadata: page?.privateMetadata?.map(mapMetadataItemToInput) || [],
  publicationDate: page?.publicationDate || "",
  seoDescription: page?.seoDescription || "",
  seoTitle: page?.seoTitle || "",
  slug: page?.slug || "",
  title: page?.title || ""
});

function usePageForm(
  page: PageDetails_page,
  onSubmit: (data: PageData) => SubmitPromise,
  opts: UsePageFormOpts
): UsePageUpdateFormResult {
  const pageExists = page !== null;

  const attributes = useFormset(
    pageExists
      ? getAttributeInputFromPage(page)
      : opts.selectedPageType
      ? getAttributeInputFromPageType(opts.selectedPageType)
      : []
  );
  const attributesWithNewFileValue = useFormset<null, File>([]);

  const {
    handleChange,
    triggerChange,
    setChanged,
    hasChanged,
    data: formData,
    formId
  } = useForm(getInitialFormData(page), undefined, {
    confirmLeave: true
  });

  const { setExitDialogSubmitRef } = useExitFormDialog({
    formId
  });

  const [content, changeContent] = useRichText({
    initial: pageExists ? page?.content : null,
    triggerChange
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handlePageTypeSelect = createPageTypeSelectHandler(
    opts.onSelectPageType,
    triggerChange
  );
  const handleAttributeChange = createAttributeChangeHandler(
    attributes.change,
    triggerChange
  );
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes.change,
    triggerChange
  );
  const handleFetchReferences = createFetchReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchReferencePages,
    opts.fetchReferenceProducts
  );
  const handleFetchMoreReferences = createFetchMoreReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchMoreReferencePages,
    opts.fetchMoreReferenceProducts
  );
  const handleAttributeFileChange = createAttributeFileChangeHandler(
    attributes.change,
    attributesWithNewFileValue.data,
    attributesWithNewFileValue.add,
    attributesWithNewFileValue.change,
    triggerChange
  );
  const handleAttributeValueReorder = createAttributeValueReorderHandler(
    attributes.change,
    attributes.data,
    triggerChange
  );

  // Need to make it function to always have content.current up to date
  const getData = (): PageData => ({
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts
    ),
    content: content.current,
    pageType: pageExists ? page?.pageType : opts.selectedPageType
  });

  const getSubmitData = (): PageSubmitData => ({
    ...getData(),
    ...getMetadata(formData, isMetadataModified, isPrivateMetadataModified),
    ...getPublicationData(formData),
    attributesWithNewFileValue: attributesWithNewFileValue.data
  });

  const handleSubmit = async (data: PageData) => {
    const errors = await onSubmit(data);

    if (!errors?.length && pageExists) {
      attributesWithNewFileValue.set([]);
    }

    return errors;
  };

  const handleFormSubmit = useHandleFormSubmit({
    formId,
    onSubmit: handleSubmit,
    setChanged
  });

  const submit = () => handleFormSubmit(getSubmitData());

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  const valid = pageExists || !!opts.selectedPageType;

  return {
    change: handleChange,
    data: getData(),
    valid,
    handlers: {
      changeContent,
      changeMetadata,
      fetchMoreReferences: handleFetchMoreReferences,
      fetchReferences: handleFetchReferences,
      reorderAttributeValue: handleAttributeValueReorder,
      selectAttribute: handleAttributeChange,
      selectAttributeFile: handleAttributeFileChange,
      selectAttributeMulti: handleAttributeMultiChange,
      selectAttributeReference: handleAttributeReferenceChange,
      selectPageType: handlePageTypeSelect
    },
    hasChanged,
    submit
  };
}

const PageForm: React.FC<PageFormProps> = ({
  children,
  page,
  onSubmit,
  ...rest
}) => {
  const props = usePageForm(page, onSubmit, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

PageForm.displayName = "PageForm";
export default PageForm;
