// @ts-strict-ignore
import { DetailGroupBox } from "@dashboard/components/DetailGroupBox/DetailGroupBox";
import { Pill } from "@dashboard/components/Pill";
import { Title2 } from "@dashboard/components/Title2/Title2";
import {
  type CollectionErrorFragment,
  type PageErrorFragment,
  type ProductErrorFragment,
} from "@dashboard/graphql";
import { getFieldError, getProductErrorMessage } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Box, Input, Textarea } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

enum SeoField {
  slug = "slug",
  title = "seoTitle",
  description = "seoDescription",
}

const SLUG_REGEX = /^[a-zA-Z0-9\-_]+$/;
const maxSlugLength = 255;
const maxTitleLength = 70;
const maxDescriptionLength = 300;

export const seoCompletionMessages = defineMessages({
  sectionTitle: {
    id: "TOA3CD",
    defaultMessage: "SEO",
    description: "foldable SEO settings section title",
  },
  complete: {
    id: "bGqAdR",
    defaultMessage: "Complete",
    description: "seo complete text",
  },
  incomplete: {
    id: "y8E0iG",
    defaultMessage: "Incomplete",
    description: "seo incomplete text",
  },
});

export const isSeoFormComplete = (
  slug: string | null | undefined,
  title: string | null | undefined,
  description: string | null | undefined,
): boolean => Boolean(slug?.length && title?.length && description?.length);

interface SeoFormProps {
  description?: string | null;
  descriptionPlaceholder: string;
  disabled?: boolean;
  errors?: Array<PageErrorFragment | ProductErrorFragment | CollectionErrorFragment>;
  loading?: boolean;
  helperText?: string;
  allowEmptySlug?: boolean;
  title: string | null;
  slug: string;
  slugPlaceholder?: string;
  titlePlaceholder: string;
  onChange: (event: any) => any;
  onClick?: () => any;
  /** Skip the outer card and foldable — embed fields in a parent surface (rare). */
  unwrapped?: boolean;
  /** Horizontal inset from the main column edges. Disable when the parent already uses `paddingX={6}`. */
  columnInset?: boolean;
  /** Foldable card chrome — `secondary` matches entity detail main-column sections (white header). */
  variant?: "primary" | "secondary";
}

export const SeoForm = (props: SeoFormProps) => {
  const {
    description,
    descriptionPlaceholder,
    disabled,
    errors = [],
    loading,
    title,
    slug,
    slugPlaceholder,
    titlePlaceholder,
    onChange,
    unwrapped = false,
    columnInset = true,
    variant = "secondary",
  } = props;
  const intl = useIntl();
  const getSlugHelperMessage = () => {
    const error = !!getError(SeoField.slug);

    return error ? getSlugErrorMessage() : "";
  };
  const getSlugErrorMessage = () => {
    const error = getError(SeoField.slug);
    const { __typename: type } = error;

    return type === "ProductError"
      ? getProductErrorMessage(error as ProductErrorFragment, intl)
      : getPageErrorMessage(error as PageErrorFragment, intl);
  };
  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value === "" || SLUG_REGEX.test(value)) {
      onChange(event);
    }
  };
  const completed = isSeoFormComplete(slug, title, description);
  const getError = (fieldName: SeoField) => getFieldError(errors, fieldName);

  const fields = (
    <Box display="grid" gap={2}>
      <Box>
        <Input
          error={!!getError(SeoField.slug) || slug.length > maxSlugLength}
          name={SeoField.slug}
          label={
            <Box display="flex" gap={1}>
              <Box as="span">
                <FormattedMessage defaultMessage="Slug" id="IoDlcd" />
              </Box>
              {slug?.length > 0 && (
                <Box as="span">
                  <FormattedMessage
                    defaultMessage="({numberOfCharacters} of {maxCharacters} characters)"
                    id="yi1HSj"
                    values={{
                      maxCharacters: maxSlugLength,
                      numberOfCharacters: slug?.length,
                    }}
                  />
                </Box>
              )}
            </Box>
          }
          helperText={getSlugHelperMessage()}
          size="small"
          value={slug}
          onChange={handleSlugChange}
          disabled={loading || disabled}
          maxLength={maxSlugLength}
          placeholder={slugPlaceholder}
        />
      </Box>
      <Input
        size="small"
        error={title?.length > maxTitleLength}
        name={SeoField.title}
        value={title ?? ""}
        disabled={loading || disabled}
        onChange={onChange}
        maxLength={maxTitleLength}
        placeholder={titlePlaceholder}
        label={
          <Box display="flex" gap={1}>
            <Box as="span">
              <FormattedMessage defaultMessage="Search engine title" id="w2Cewo" />
            </Box>
            {title?.length > 0 && (
              <Box as="span">
                <FormattedMessage
                  defaultMessage="({numberOfCharacters} of {maxCharacters} characters)"
                  id="yi1HSj"
                  values={{
                    maxCharacters: maxTitleLength,
                    numberOfCharacters: title?.length,
                  }}
                />
              </Box>
            )}
          </Box>
        }
      />

      <Textarea
        error={description?.length > maxDescriptionLength}
        name={SeoField.description}
        value={description ?? ""}
        disabled={loading || disabled}
        onChange={onChange}
        maxLength={maxDescriptionLength}
        placeholder={descriptionPlaceholder}
        label={
          <Box display="flex" gap={1}>
            <span>
              <FormattedMessage id="CXTIq8" defaultMessage="Search engine description" />
            </span>
            {description?.length > 0 && (
              <span>
                <FormattedMessage
                  id="ChAjJu"
                  defaultMessage="{numberOfCharacters} of {maxCharacters} characters"
                  description="character limit"
                  values={{
                    maxCharacters: maxDescriptionLength,
                    numberOfCharacters: description.length,
                  }}
                />
              </span>
            )}
          </Box>
        }
      />
    </Box>
  );

  if (unwrapped) {
    return fields;
  }

  const form = (
    <DetailGroupBox
      groupId="seo-form"
      marginTop={0}
      dataTestId="seo-form"
      triggerButtonTestId="edit-seo"
      variant={variant}
      headerStart={
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Title2>
            <FormattedMessage {...seoCompletionMessages.sectionTitle} />
          </Title2>
          <Pill
            color={completed ? "success" : "warning"}
            size="small"
            label={intl.formatMessage(
              completed ? seoCompletionMessages.complete : seoCompletionMessages.incomplete,
            )}
            data-test-id={completed ? "seo-complete" : "seo-incomplete"}
          />
        </Box>
      }
    >
      <Box paddingX={variant === "secondary" ? 4 : 5} paddingY={4}>
        {fields}
      </Box>
    </DetailGroupBox>
  );

  if (columnInset) {
    return (
      <Box paddingX={6} width="100%">
        {form}
      </Box>
    );
  }

  return form;
};
