import { commonMessages } from "@dashboard/intl";
import { rippleSlugTranslation } from "@dashboard/translations/ripples/slugTranslation";
import {
  PageTranslationInputFieldName,
  type TranslationField,
  TranslationFieldType,
  TranslationInputFieldName,
  type TranslationSectionConfig,
  TranslationSubmitScope,
} from "@dashboard/translations/types";
import { type IntlShape } from "react-intl";

import { translationDetailMessages } from "./components/TranslationsDetailLayout/messages";

interface SeoTranslationData {
  slug?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  translationSlug?: string | null;
  translationSeoDescription?: string | null;
  translationSeoTitle?: string | null;
}

interface GeneralTranslationData {
  description?: string | null;
  name?: string | null;
  translationDescription?: string | null;
  translationName?: string | null;
}

export function createGeneralNameDescriptionSection(
  intl: IntlShape,
  data: GeneralTranslationData,
  options?: {
    descriptionLabel?: string;
    nameLabel?: string;
  },
): TranslationSectionConfig {
  return {
    id: "general",
    submitScope: TranslationSubmitScope.entity,
    subtitle: intl.formatMessage(translationDetailMessages.generalSectionSubtitle),
    title: intl.formatMessage(commonMessages.generalInformations),
    fields: [
      {
        displayName: options?.nameLabel ?? intl.formatMessage(commonMessages.name),
        hint: intl.formatMessage(translationDetailMessages.nameFieldHint),
        name: TranslationInputFieldName.name,
        translation: data.translationName ?? null,
        type: TranslationFieldType.SHORT,
        value: data.name ?? "",
      },
      {
        displayName: options?.descriptionLabel ?? intl.formatMessage(commonMessages.description),
        hint: intl.formatMessage(translationDetailMessages.descriptionFieldHint),
        name: TranslationInputFieldName.description,
        translation: data.translationDescription ?? null,
        type: TranslationFieldType.RICH,
        value: data.description ?? "",
      },
    ],
  };
}

export function createSeoTranslationSection(
  intl: IntlShape,
  data: SeoTranslationData,
): TranslationSectionConfig {
  return {
    id: "seo",
    submitScope: TranslationSubmitScope.entity,
    subtitle: intl.formatMessage(translationDetailMessages.seoSectionSubtitle),
    title: intl.formatMessage({
      id: "TGX4T1",
      defaultMessage: "Search Engine Preview",
    }),
    fields: [
      {
        displayName: intl.formatMessage({
          id: "FDaFNL",
          defaultMessage: "Search Engine Slug",
        }),
        hint: intl.formatMessage(translationDetailMessages.seoSlugFieldHint),
        name: TranslationInputFieldName.slug,
        ripple: rippleSlugTranslation,
        translation: data.translationSlug ?? null,
        type: TranslationFieldType.SHORT,
        value: data.slug ?? "",
      },
      {
        displayName: intl.formatMessage({
          id: "HlEpii",
          defaultMessage: "Search Engine Title",
        }),
        hint: intl.formatMessage(translationDetailMessages.seoTitleFieldHint),
        name: TranslationInputFieldName.seoTitle,
        translation: data.translationSeoTitle ?? null,
        type: TranslationFieldType.SHORT,
        value: data.seoTitle ?? "",
      },
      {
        displayName: intl.formatMessage({
          id: "US3IPU",
          defaultMessage: "Search Engine Description",
        }),
        hint: intl.formatMessage(translationDetailMessages.seoDescriptionFieldHint),
        name: TranslationInputFieldName.seoDescription,
        translation: data.translationSeoDescription ?? null,
        type: TranslationFieldType.LONG,
        value: data.seoDescription ?? "",
      },
    ],
  };
}

export function createPageGeneralSection(
  intl: IntlShape,
  data: {
    content?: string | null;
    title?: string | null;
    translationContent?: string | null;
    translationTitle?: string | null;
  },
): TranslationSectionConfig {
  return {
    id: "general",
    submitScope: TranslationSubmitScope.entity,
    subtitle: intl.formatMessage(translationDetailMessages.pageGeneralSectionSubtitle),
    title: intl.formatMessage(commonMessages.generalInformations),
    fields: [
      {
        displayName: intl.formatMessage({
          id: "gr+oXW",
          defaultMessage: "Title",
          description: "page title",
        }),
        hint: intl.formatMessage(translationDetailMessages.pageTitleFieldHint),
        name: PageTranslationInputFieldName.title,
        translation: data.translationTitle ?? null,
        type: TranslationFieldType.SHORT,
        value: data.title ?? "",
      },
      {
        displayName: intl.formatMessage({
          id: "gMwpNC",
          defaultMessage: "Content",
          description: "page content",
        }),
        hint: intl.formatMessage(translationDetailMessages.pageContentFieldHint),
        name: PageTranslationInputFieldName.content,
        translation: data.translationContent ?? null,
        type: TranslationFieldType.RICH,
        value: data.content ?? "",
      },
    ],
  };
}

export function createSingleNameSection(
  intl: IntlShape,
  data: {
    name?: string | null;
    translationName?: string | null;
  },
  options: {
    nameLabel: string;
  },
): TranslationSectionConfig {
  return {
    id: "general",
    submitScope: TranslationSubmitScope.entity,
    subtitle: intl.formatMessage(translationDetailMessages.generalSectionSubtitle),
    title: intl.formatMessage(commonMessages.generalInformations),
    fields: [
      {
        displayName: options.nameLabel,
        hint: intl.formatMessage(translationDetailMessages.nameFieldHint),
        name: TranslationInputFieldName.name,
        translation: data.translationName ?? null,
        type: TranslationFieldType.SHORT,
        value: data.name ?? "",
      },
    ],
  };
}

export function createAttributeValuesSection(
  intl: IntlShape,
  fields: TranslationField[],
): TranslationSectionConfig {
  return {
    id: "attributes",
    submitScope: TranslationSubmitScope.attributeValue,
    subtitle: intl.formatMessage(translationDetailMessages.attributesSectionSubtitle),
    title: intl.formatMessage(commonMessages.translationAttributes),
    fields,
  };
}
