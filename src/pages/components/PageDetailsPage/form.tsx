import { OutputData } from "@editorjs/editorjs";
import { MetadataFormData } from "@saleor/components/Metadata";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import { PageTypeFragment } from "@saleor/fragments/types/PageTypeFragment";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, { FormsetChange } from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import {
  PageDetails_page,
  PageDetails_page_pageType
} from "@saleor/pages/types/PageDetails";
import { getAttributeInputFromPage } from "@saleor/pages/utils/data";
import { createPageTypeSelectHandler } from "@saleor/pages/utils/handlers";
import {
  createAttributeChangeHandler,
  createAttributeMultiChangeHandler
} from "@saleor/products/utils/handlers";
import getPublicationData from "@saleor/utils/data/getPublicationData";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React from "react";

import { PageAttributeInput, PageAttributeInputData } from "../PageAttributes";

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
  attributes: PageAttributeInput[];
  content: OutputData;
}

interface PageUpdateHandlers {
  changeMetadata: FormChange;
  changeContent: RichTextEditorChange;
  selectPageType: FormChange;
  changeAttribute: FormsetChange<string>;
  changeAttributeMulti: FormsetChange<string>;
}
export interface UsePageUpdateFormResult {
  change: FormChange;
  data: PageData;
  pageType: PageTypeFragment;
  handlers: PageUpdateHandlers;
  hasChanged: boolean;
  submit: () => void;
}

export interface PageFormProps {
  children: (props: UsePageUpdateFormResult) => React.ReactNode;
  page: PageDetails_page;
  pageTypes?: PageDetails_page_pageType[];
  onSubmit: (data: PageData) => SubmitPromise;
}

function usePageForm(
  page: PageDetails_page,
  onSubmit: (data: PageData) => SubmitPromise,
  pageTypes?: PageDetails_page_pageType[]
): UsePageUpdateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const pageExists = page !== null;

  const attributesFromPage = React.useMemo(
    () => getAttributeInputFromPage(page),
    [page]
  );

  const {
    change: changeAttributeData,
    data: attributes,
    set: setAttributeData
  } = useFormset<PageAttributeInputData>(attributesFromPage || []);

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
    setAttributeData,
    setPageType,
    pageTypes
  );
  const changeAttribute = createAttributeChangeHandler(
    changeAttributeData,
    triggerChange
  );
  const changeAttributeMulti = createAttributeMultiChangeHandler(
    changeAttributeData,
    attributes,
    triggerChange
  );

  // Need to make it function to always have content.current up to date
  const getData = (): PageData => ({
    ...form.data,
    attributes,
    content: content.current
  });

  const getSubmitData = (): PageData => ({
    ...getData(),
    ...getMetadata(form.data, isMetadataModified, isPrivateMetadataModified),
    ...getPublicationData(form.data)
  });

  const submit = () =>
    pageExists
      ? handleFormSubmit(getSubmitData(), onSubmit, setChanged)
      : onSubmit(getSubmitData());

  return {
    change: handleChange,
    data: getData(),
    handlers: {
      changeAttribute,
      changeAttributeMulti,
      changeContent,
      changeMetadata,
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
  pageTypes,
  onSubmit
}) => {
  const props = usePageForm(page, onSubmit, pageTypes);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

PageForm.displayName = "PageForm";
export default PageForm;
