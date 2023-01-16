import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { LanguageFragment } from "@dashboard/graphql";
import { languageEntitiesUrl } from "@dashboard/translations/urls";
import { Card, TableBody, TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

import { maybe, renderCollection } from "../../../misc";

export interface TranslationsLanguageListProps {
  languages: LanguageFragment[];
}

const useStyles = makeStyles(
  {
    capitalize: {
      textTransform: "capitalize",
    },
    link: {
      cursor: "pointer",
    },
  },
  { name: "TranslationsLanguageList" },
);

const TranslationsLanguageList: React.FC<TranslationsLanguageListProps> = props => {
  const { languages } = props;

  const classes = useStyles(props);

  return (
    <Card>
      <ResponsiveTable>
        <TableHead>
          <TableRowLink>
            <TableCell>
              <FormattedMessage id="y1Z3or" defaultMessage="Language" />
            </TableCell>
          </TableRowLink>
        </TableHead>
        <TableBody>
          {renderCollection(
            languages,
            language => (
              <TableRowLink
                data-test-id={language ? language.code : "skeleton"}
                className={!!language ? classes.link : undefined}
                hover={!!language}
                key={language ? language.code : "skeleton"}
                href={language && languageEntitiesUrl(language.code, {})}
              >
                <TableCell className={classes.capitalize}>
                  {maybe<React.ReactNode>(
                    () => language.language,
                    <Skeleton />,
                  )}
                </TableCell>
              </TableRowLink>
            ),
            () => (
              <TableRowLink>
                <TableCell colSpan={1}>
                  <FormattedMessage
                    id="ptPPVk"
                    defaultMessage="No languages found"
                  />
                </TableCell>
              </TableRowLink>
            ),
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
TranslationsLanguageList.displayName = "TranslationsLanguageList";
export default TranslationsLanguageList;
