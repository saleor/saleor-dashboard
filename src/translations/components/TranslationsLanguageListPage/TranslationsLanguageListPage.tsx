import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
// tslint:disable no-submodule-imports
import { LanguageFragment } from "@saleor/graphql";
import React from "react";
import { useIntl } from "react-intl";

import TranslationsLanguageList from "../TranslationsLanguageList";

export interface TranslationsLanguageListPageProps {
  languages: LanguageFragment[];
  //   onAdd: () => void;
  onRowClick: (code: string) => void;
}

const TranslationsLanguageListPage: React.FC<TranslationsLanguageListPageProps> = ({
  languages,
  onRowClick
}) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader
        title={intl.formatMessage({
          defaultMessage: "Languages"
        })}
      >
        {/* <Button color="primary" variant="contained" onClick={onAdd}>
        <FormattedMessage
      defaultMessage="Add Language"
      description="button"
    />
       
      </Button> */}
      </PageHeader>
      <TranslationsLanguageList languages={languages} onRowClick={onRowClick} />
    </Container>
  );
};
TranslationsLanguageListPage.displayName = "TranslationsLanguageListPage";
export default TranslationsLanguageListPage;
