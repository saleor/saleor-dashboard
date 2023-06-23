// @ts-strict-ignore
import React from "react";

import TranslationsLanguageListPage, {
  TranslationsLanguageListPageProps,
} from "../../../translations/components/TranslationsLanguageListPage";
import { languages } from "../../../translations/fixtures";

const props: TranslationsLanguageListPageProps = {
  languages,
};

export default {
  title: "Translations / Language list",
};

export const Default = () => <TranslationsLanguageListPage {...props} />;

export const Loading = () => (
  <TranslationsLanguageListPage {...props} languages={undefined} />
);

export const NoData = () => (
  <TranslationsLanguageListPage {...props} languages={[]} />
);
