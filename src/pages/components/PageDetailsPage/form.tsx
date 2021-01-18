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
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import { PageTypeFragment } from "@saleor/fragments/types/PageTypeFragment";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import {
  PageDetails_page,
  PageDetails_page_pageType
} from "@saleor/pages/types/PageDetails";
import { getAttributeInputFromPage } from "@saleor/pages/utils/data";
import { createPageTypeSelectHandler } from "@saleor/pages/utils/handlers";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import getPublicationData from "@saleor/utils/data/getPublicationData";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React from "react";

export interface PageFormData extends MetadataFormData {
  isPublished: boolean;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  title: string;
  pageType: string;
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
export interface UsePageUpdateFormResult {
  change: FormChange;
  data: PageData;
  pageType: PageTypeFragment;
  handlers: PageUpdateHandlers;
  hasChanged: boolean;
  submit: () => void;
}

export interface UsePageFormOpts {
  pageTypes?: PageDetails_page_pageType[];
  referencePages: SearchPages_search_edges_node[];
  referenceProducts: SearchProducts_search_edges_node[];
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
}

export interface PageFormProps extends UsePageFormOpts {
  children: (props: UsePageUpdateFormResult) => React.ReactNode;
  page: PageDetails_page;
  pageTypes?: PageDetails_page_pageType[];
  onSubmit: (data: PageData) => SubmitPromise;
}

function usePageForm(
  page: PageDetails_page,
  onSubmit: (data: PageData) => SubmitPromise,
  opts: UsePageFormOpts
): UsePageUpdateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const pageExists = page !== null;

  const attributes = useFormset(getAttributeInputFromPage(page));
  const attributesWithNewFileValue = useFormset<null, File>([]);

  const form = useForm<PageFormData>({
    isPublished: page?.isPublished,
    metadata: pageExists ? page?.metadata?.map(mapMetadataItemToInput) : [],
    pageType: page?.pageType.id || "",
    privateMetadata: pageExists
      ? page?.privateMetadata?.map(mapMetadataItemToInput)
      : [],
    publicationDate: page?.publicationDate || "",
    seoDescription: page?.seoDescription || "",
    seoTitle: page?.seoTitle || "",
    slug: page?.slug || "",
    title: page?.title || ""
  });
  const [content, changeContent] = useRichText({
    initial: pageExists ? page?.contentJson : null,
    triggerChange
  });

  const [pageType, setPageType] = useStateFromProps<PageTypeFragment>(
    page?.pageType || null
  );

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const selectPageType = createPageTypeSelectHandler(
    handleChange,
    attributes.set,
    setPageType,
    opts.pageTypes
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
    ...form.data,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts
    ),
    content: content.current
  });

  const getSubmitData = (): PageSubmitData => ({
    ...getData(),
    ...getMetadata(form.data, isMetadataModified, isPrivateMetadataModified),
    ...getPublicationData(form.data),
    attributesWithNewFileValue: attributesWithNewFileValue.data
  });

  const handleSubmit = async (data: PageData) => {
    const errors = await onSubmit(data);

    if (!errors?.length && pageExists) {
      attributesWithNewFileValue.set([]);
    }

    return errors;
  };

  const submit = () =>
    pageExists
      ? handleFormSubmit(getSubmitData(), handleSubmit, setChanged)
      : onSubmit(getSubmitData());

  return {
    change: handleChange,
    data: getData(),
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
      selectPageType
    },
    hasChanged: changed,
    pageType,
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
