// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import Skeleton from "@dashboard/components/Skeleton";
import TableRowLink from "@dashboard/components/TableRowLink";
import { LanguageFragment } from "@dashboard/graphql";
import { languageEntitiesUrl } from "@dashboard/translations/urls";
import { TableBody, TableCell } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import { clsx } from "clsx";
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
    cardContent: {
      paddingLeft: 0,
    },
    link: {
      cursor: "pointer",
    },
    rowLink: {
      "& .MuiTableCell-root": {
        paddingLeft: `${vars.spacing[6]} !important`,
      },
    },
  },
  { name: "TranslationsLanguageList" },
);
const TranslationsLanguageList: React.FC<TranslationsLanguageListProps> = props => {
  const { languages } = props;
  const classes = useStyles(props);

  return (
    <DashboardCard>
      <DashboardCard.Content className={classes.cardContent}>
        <ResponsiveTable>
          <TableBody data-test-id="translation-list-view">
            {renderCollection(
              languages,
              language => (
                <TableRowLink
                  data-test-id={language ? language.code : "skeleton"}
                  // className={!!language ? classes.link : undefined}
                  className={clsx(
                    {
                      [classes.link]: !!language,
                    },
                    classes.rowLink,
                  )}
                  hover={!!language}
                  key={language ? language.code : "skeleton"}
                  href={language && languageEntitiesUrl(language.code, {})}
                >
                  <TableCell className={classes.capitalize}>
                    {maybe<React.ReactNode>(() => language.language, <Skeleton />)}
                  </TableCell>
                </TableRowLink>
              ),
              () => (
                <TableRowLink>
                  <TableCell colSpan={1}>
                    <FormattedMessage id="ptPPVk" defaultMessage="No languages found" />
                  </TableCell>
                </TableRowLink>
              ),
            )}
          </TableBody>
        </ResponsiveTable>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

TranslationsLanguageList.displayName = "TranslationsLanguageList";
export default TranslationsLanguageList;
