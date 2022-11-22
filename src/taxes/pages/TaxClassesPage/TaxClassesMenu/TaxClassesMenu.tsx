import { Card, CardContent, Divider } from "@material-ui/core";
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
import { isLastElement } from "@saleor/taxes/utils/utils";
import clsx from "clsx";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../TaxCountriesPage/TaxCountriesMenu/styles";

interface TaxClassesMenuProps {
  taxClasses: TaxClassFragment[] | undefined;
  selectedTaxClassId: string;
  onTaxClassDelete: (taxClassId: string) => void;
  onCreateNew: () => void;
}

export const TaxClassesMenu: React.FC<TaxClassesMenuProps> = ({
  taxClasses,
  selectedTaxClassId,
  onTaxClassDelete,
  onCreateNew,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const isCreatingNew = selectedTaxClassId === "new";

  return (
    <Card className={classes.menu}>
      <CardTitle
        title={intl.formatMessage(taxesMessages.taxClassList)}
        toolbar={
          <Button
            variant="secondary"
            onClick={onCreateNew}
            disabled={isCreatingNew}
          >
            <FormattedMessage {...taxesMessages.addTaxClassLabel} />
          </Button>
        }
      />

      {taxClasses?.length !== 0 ? (
        <>
          <ListHeader>
            <ListItem className={classes.tableRow}>
              <ListItemCell>
                <FormattedMessage {...taxesMessages.taxClassNameHeader} />
              </ListItemCell>
            </ListItem>
          </ListHeader>
          <Divider />
          <List gridTemplate={["1fr"]}>
            {taxClasses?.map((taxClass, taxClassId) => (
              <React.Fragment key={taxClass.id}>
                <ListItemLink
                  className={clsx(classes.clickable, classes.tableRow, {
                    [classes.selected]: taxClass.id === selectedTaxClassId,
                  })}
                  href={taxClassesListUrl(taxClass.id)}
                >
                  <ListItemCell>
                    <div className={classes.spaceBetween}>
                      {taxClass.name}
                      {taxClass.id !== "new" && (
                        <IconButton
                          variant="secondary"
                          onClick={event => {
                            event.stopPropagation();
                            event.preventDefault();
                            onTaxClassDelete(taxClass.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </div>
                  </ListItemCell>
                </ListItemLink>
                {!isLastElement(taxClasses, taxClassId) && <Divider />}
              </React.Fragment>
            )) ?? <Skeleton />}
          </List>
        </>
      ) : (
        <CardContent className={classes.greyText}>
          <FormattedMessage {...taxesMessages.noTaxClasses} />
        </CardContent>
      )}
    </Card>
  );
};

export default TaxClassesMenu;
