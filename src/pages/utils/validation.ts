import {
  PageErrorCode,
  PageErrorWithAttributesFragment,
} from "@saleor/graphql";

import { PageData } from "../components/PageDetailsPage/form";

const createEmptyRequiredError = (
  field: string,
): PageErrorWithAttributesFragment => ({
  __typename: "PageError",
  code: PageErrorCode.REQUIRED,
  field,
  message: null,
  attributes: [],
});

export const validatePageCreateData = (data: PageData) => {
  let errors: PageErrorWithAttributesFragment[] = [];

  if (!data.pageType) {
    errors = [...errors, createEmptyRequiredError("pageType")];
  }

  if (!data.title) {
    errors = [...errors, createEmptyRequiredError("title")];
  }

  return errors;
};
