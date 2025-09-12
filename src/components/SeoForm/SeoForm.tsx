// @ts-strict-ignore
import {
  CollectionErrorFragment,
  PageErrorFragment,
  ProductErrorFragment,
} from "@dashboard/graphql";
import { getFieldError, getProductErrorMessage } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { Accordion, Box, Input, Text, Textarea } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DashboardCard } from "../Card";

enum SeoField {
  slug = "slug",
  title = "seoTitle",
  description = "seoDescription",
}

const SLUG_REGEX = /^[a-zA-Z0-9\-_]+$/;
const maxSlugLength = 255;
const maxTitleLength = 70;
const maxDescriptionLength = 300;

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
  const completed = slug?.length > 0 && title?.length > 0 && description?.length > 0;
  const getError = (fieldName: SeoField) => getFieldError(errors, fieldName);

  return (
    <DashboardCard paddingTop={6}>
      <DashboardCard.Content>
        <Accordion>
          <Accordion.Item value="seo-accordion">
            <Accordion.Trigger>
              <Box display="grid" gap={2}>
                <Text size={5} fontWeight="bold">
                  <FormattedMessage defaultMessage="Search Engine Preview" id="TGX4T1" />
                </Text>
                <Text size={2} color="default2">
                  {completed ? (
                    <FormattedMessage
                      id="bGqAdR"
                      defaultMessage="Complete"
                      description="seo complete text"
                    />
                  ) : (
                    <FormattedMessage
                      id="y8E0iG"
                      defaultMessage="Incomplete"
                      description="seo incomplete text"
                    />
                  )}
                </Text>
              </Box>
              <Accordion.TriggerButton dataTestId="edit-seo" />
            </Accordion.Trigger>
            <Accordion.Content>
              <Box display="grid" gap={2} marginTop={4}>
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
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
