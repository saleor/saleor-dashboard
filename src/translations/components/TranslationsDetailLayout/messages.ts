import { defineMessages } from "react-intl";

export const translationDetailMessages = defineMessages({
  translatingFromTo: {
    id: "1sSrNS",
    defaultMessage: "Translating from {sourceLanguage} to {targetLanguage}",
    description: "translation context bar",
  },
  translatingTo: {
    id: "oj4cW/",
    defaultMessage: "Translating original content to {targetLanguage}",
    description: "translation context bar without known source language",
  },
  originalLabel: {
    id: "qyLv3R",
    defaultMessage: "Original",
    description: "label for untranslated base content",
  },
  fieldsTranslated: {
    id: "ez6WHE",
    defaultMessage: "{completed} of {total} fields translated",
    description: "translation progress count",
  },
  editInBulk: {
    id: "jxCLwG",
    defaultMessage: "Edit in bulk",
    description: "bulk edit toggle label",
  },
  translated: {
    id: "x/N8AY",
    defaultMessage: "Translated",
    description: "field translation status",
  },
  needsTranslation: {
    id: "iSp+AA",
    defaultMessage: "Needs translation",
    description: "field translation status",
  },
  noTranslationYet: {
    id: "9agEIc",
    defaultMessage: "No translation yet",
    description: "empty translation placeholder",
  },
  saveAllTranslations: {
    id: "uR2ks6",
    defaultMessage: "Save changes",
    description: "bulk save button",
  },
  translationSaved: {
    id: "t/eWc4",
    defaultMessage: "Translation saved",
    description: "single translation save success",
  },
  allTranslationsSaved: {
    id: "ZJh40A",
    defaultMessage: "All translations saved",
    description: "bulk translation save success",
  },
  bulkSaveFailed: {
    id: "yjN2GA",
    defaultMessage:
      "{count, plural, one {# field could not be saved} other {# fields could not be saved}}",
    description: "bulk translation save error summary",
  },
  editField: {
    id: "B9jV/6",
    defaultMessage: "Edit",
    description: "edit single translation field",
  },
  generalSectionSubtitle: {
    id: "gGSCAj",
    defaultMessage: "Core content shown on the storefront",
    description: "general translation section subtitle",
  },
  pageGeneralSectionSubtitle: {
    id: "10kBsY",
    defaultMessage: "Title and content shown on the model page",
    description: "page translation section subtitle",
  },
  seoSectionSubtitle: {
    id: "5cKZsg",
    defaultMessage: "How this item appears in search results",
    description: "seo translation section subtitle",
  },
  attributesSectionSubtitle: {
    id: "iUhCur",
    defaultMessage: "Custom attribute values assigned to this item",
    description: "attributes translation section subtitle",
  },
  nameFieldHint: {
    id: "OqQ2Si",
    defaultMessage: "Displayed as the primary name in your storefront",
    description: "name field hint",
  },
  descriptionFieldHint: {
    id: "d+Wc8t",
    defaultMessage: "Main description content for this item",
    description: "description field hint",
  },
  pageTitleFieldHint: {
    id: "bin73/",
    defaultMessage: "Displayed as the page title in your storefront",
    description: "page title field hint",
  },
  pageContentFieldHint: {
    id: "pTja1U",
    defaultMessage: "Main body content of the model page",
    description: "page content field hint",
  },
  seoSlugFieldHint: {
    id: "mVcZkr",
    defaultMessage: "URL path used in localized storefront links",
    description: "seo slug field hint",
  },
  seoTitleFieldHint: {
    id: "wS1Wms",
    defaultMessage: "Title tag shown in browser tabs and search results",
    description: "seo title field hint",
  },
  seoDescriptionFieldHint: {
    id: "HNwxfx",
    defaultMessage: "Meta description shown in search engine previews",
    description: "seo description field hint",
  },
});
