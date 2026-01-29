import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { LanguageFragment } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import TranslationsLanguageList from "../TranslationsLanguageList";

interface TranslationsLanguageListPageProps {
  languages: LanguageFragment[];
}

const TranslationsLanguageListPage = ({ languages }: TranslationsLanguageListPageProps) => {
  const intl = useIntl();

  return (
    <>
      <TopNav
        title={intl.formatMessage({
          id: "GsBRWL",
          defaultMessage: "Languages",
        })}
      ></TopNav>
      <Box paddingY={6}>
        <TranslationsLanguageList languages={languages} />
      </Box>
    </>
  );
};

TranslationsLanguageListPage.displayName = "TranslationsLanguageListPage";
export default TranslationsLanguageListPage;
