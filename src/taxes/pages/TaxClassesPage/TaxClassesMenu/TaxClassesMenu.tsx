import { Card } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ListItemLink from "@saleor/components/ListItemLink";
import Skeleton from "@saleor/components/Skeleton";
import { TaxClassFragment } from "@saleor/graphql";
import {
  Button,
  DeleteIcon,
  IconButton,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import { taxClassesListUrl } from "@saleor/taxes/urls";
import { isOnlyTaxClass } from "@saleor/taxes/utils/utils";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../TaxCountriesPage/TaxCountriesMenu/styles";

interface TaxClassesMenuProps {
  taxClasses: TaxClassFragment[] | undefined;
  selectedTaxClassId: string;
  onTaxClassDelete: (taxClassId: string) => void;
}

export const TaxClassesMenu: React.FC<TaxClassesMenuProps> = ({
  taxClasses,
  selectedTaxClassId,
  onTaxClassDelete,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(taxesMessages.taxClassList)}
        toolbar={
          <Button variant="secondary">
            <FormattedMessage {...taxesMessages.addTaxClassLabel} />
          </Button>
        }
      />
      <List gridTemplate={["1fr"]}>
        <ListHeader>
          <ListItem className={classes.tableRow}>
            <ListItemCell>
              <FormattedMessage {...taxesMessages.taxClassNameHeader} />
            </ListItemCell>
          </ListItem>
        </ListHeader>
        {taxClasses?.map(taxClass => (
          <ListItemLink
            key={taxClass.id}
            className={clsx(classes.clickable, classes.tableRow, {
              [classes.selected]: taxClass.id === selectedTaxClassId,
            })}
            href={taxClassesListUrl(taxClass.id)}
          >
            <ListItemCell>
              <div className={classes.spaceBetween}>
                {taxClass.name}
                {!isOnlyTaxClass(taxClasses) && (
                  <IconButton
                    variant="secondary"
                    onClick={event => {
                      event.stopPropagation();
                      onTaxClassDelete(taxClass.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            </ListItemCell>
          </ListItemLink>
        )) ?? <Skeleton />}
      </List>
    </Card>
  );
};

export default TaxClassesMenu;
