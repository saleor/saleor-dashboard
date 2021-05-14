import {
  Card,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { ShopInfo_shop_languages } from "@saleor/components/Shop/types/ShopInfo";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { FormattedMessage } from "react-intl";

import { maybe, renderCollection } from "../../../misc";

export interface TranslationsLanguageListProps {
  languages: ShopInfo_shop_languages[];
  onRowClick: (code: string) => void;
}

const useStyles = makeStyles(
  {
    capitalize: {
      textTransform: "capitalize"
    },
    link: {
      cursor: "pointer"
    }
  },
  { name: "TranslationsLanguageList" }
);

const TranslationsLanguageList: React.FC<TranslationsLanguageListProps> = props => {
  const { languages, onRowClick } = props;

  const classes = useStyles(props);

  return (
    <Card>
      <ResponsiveTable>
        <TableHead>
          <TableRow>
            <TableCell>
              <FormattedMessage defaultMessage="Language" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCollection(
            languages,
            language => (
              <TableRow
                className={!!language ? classes.link : undefined}
                hover={!!language}
                key={language ? language.code : "skeleton"}
                onClick={() => onRowClick(language.code)}
              >
                <TableCell className={classes.capitalize}>
                  {maybe<React.ReactNode>(
                    () => language.language,
                    <Skeleton />
                  )}
                </TableCell>
              </TableRow>
            ),
            () => (
              <TableRow>
                <TableCell colSpan={1}>
                  <FormattedMessage defaultMessage="No languages found" />
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </ResponsiveTable>
    </Card>
  );
};
TranslationsLanguageList.displayName = "TranslationsLanguageList";
export default TranslationsLanguageList;
