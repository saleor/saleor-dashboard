import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import TranslationsLanguageListPage, {
  TranslationsLanguageListPageProps,
} from "../../../translations/components/TranslationsLanguageListPage";
import { languages } from "../../../translations/fixtures";

const props: TranslationsLanguageListPageProps = {
  languages,
};

storiesOf("Translations / Language list", module)
  .addDecorator(Decorator)
  .add("default", () => <TranslationsLanguageListPage {...props} />)
  .add("loading", () => (
    <TranslationsLanguageListPage {...props} languages={undefined} />
  ))
  .add("no data", () => (
    <TranslationsLanguageListPage {...props} languages={[]} />
  ));
