import Card from "@material-ui/core/Card";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FormattedMessage } from "react-intl";

// tslint:disable no-submodule-imports
import { ShopInfo_shop_languages } from "@saleor/components/Shop/types/ShopInfo";
import Skeleton from "@saleor/components/Skeleton";
import { maybe, renderCollection } from "../../../misc";

export interface TranslationsLanguageListProps {
  languages: ShopInfo_shop_languages[];
  onRowClick: (code: string) => void;
}

const styles = createStyles({
  capitalize: {
    textTransform: "capitalize"
  },
  link: {
    cursor: "pointer"
  }
});

const TranslationsLanguageList = withStyles(styles, {
  name: "TranslationsLanguageList"
})(
  ({
    classes,
    languages,
    onRowClick
  }: TranslationsLanguageListProps & WithStyles<typeof styles>) => (
    <Card>
      <Table>
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
      </Table>
    </Card>
  )
);
TranslationsLanguageList.displayName = "TranslationsLanguageList";
export default TranslationsLanguageList;
