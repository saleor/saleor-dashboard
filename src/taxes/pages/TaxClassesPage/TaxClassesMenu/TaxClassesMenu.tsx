import { CardTitle } from "@dashboard/components/CardTitle/CardTitle";
import ListItemLink from "@dashboard/components/ListItemLink";
import { TaxClassFragment } from "@dashboard/graphql";
import { taxesMessages } from "@dashboard/taxes/messages";
import { taxClassesListUrl } from "@dashboard/taxes/urls";
import { isLastElement } from "@dashboard/taxes/utils/utils";
import { Card, CardContent, Divider } from "@material-ui/core";
import { List, ListHeader, ListItem, ListItemCell } from "@saleor/macaw-ui";
import { Button, Skeleton, TrashBinIcon } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { Fragment } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "../../TaxCountriesPage/TaxCountriesMenu/styles";

interface TaxClassesMenuProps {
  taxClasses: TaxClassFragment[] | undefined;
  selectedTaxClassId: string;
  onTaxClassDelete: (taxClassId: string) => void;
  onCreateNew: () => void;
}

const TaxClassesMenu = ({
  taxClasses,
  selectedTaxClassId,
  onTaxClassDelete,
  onCreateNew,
}: TaxClassesMenuProps) => {
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
            data-test-id="create-class-button"
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
              <Fragment key={taxClass.id}>
                <ListItemLink
                  data-test-id="class-list-rows"
                  className={clsx(classes.clickable, classes.tableRow, {
                    [classes.selected]: taxClass.id === selectedTaxClassId,
                  })}
                  href={taxClassesListUrl(taxClass.id)}
                >
                  <ListItemCell>
                    <div className={classes.spaceBetween}>
                      {taxClass.name}
                      {taxClass.id !== "new" && (
                        <Button
                          data-test-id="class-delete-button"
                          icon={<TrashBinIcon />}
                          variant="tertiary"
                          onClick={event => {
                            event.stopPropagation();
                            event.preventDefault();
                            onTaxClassDelete(taxClass.id);
                          }}
                        />
                      )}
                    </div>
                  </ListItemCell>
                </ListItemLink>
                {!isLastElement(taxClasses, taxClassId) && <Divider />}
              </Fragment>
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
