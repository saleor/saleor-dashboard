import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
// tslint:disable no-submodule-imports
import { LanguageFragment } from "@saleor/graphql";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsLanguageList from "../TranslationsLanguageList";

export interface TranslationsLanguageListPageProps {
  languages: LanguageFragment[];
}

const TranslationsLanguageListPage: React.FC<TranslationsLanguageListPageProps> = ({
  languages,
}) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader
        title={intl.formatMessage({
          id: "GsBRWL",
          defaultMessage: "Languages",
        })}
      >
        {/* <Button color="primary" variant="contained" onClick={onAdd}>
        <FormattedMessage
      id="crvD6X"
      defaultMessage="Add Language"
      description="button"
    />
       
      </Button> */}
      </PageHeader>
      <TranslationsLanguageList languages={languages} />
    </Container>
  );
};
TranslationsLanguageListPage.displayName = "TranslationsLanguageListPage";
export default TranslationsLanguageListPage;
