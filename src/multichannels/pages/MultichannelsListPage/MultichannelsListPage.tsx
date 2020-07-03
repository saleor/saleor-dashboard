import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
// import SearchInput from "@saleor/components/SearchInput";
import Skeleton from "@saleor/components/Skeleton";
import TableCellHeader from "@saleor/components/TableCellHeader";
import { sectionNames } from "@saleor/intl";
import { renderCollection, stopPropagation } from "@saleor/misc";
import { SearchPageProps } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface MultichannelsListPageProps extends SearchPageProps {
  channelsList: any[];
  navigateToChannelCreate: () => void;
  disabled: boolean;
  onBack: () => void;
  onRowClick: (id: string) => () => void;
  onRemove: (id: string) => void;
}

const numberOfColumns = 2;

export const MultichannelsListPage: React.FC<MultichannelsListPageProps> = ({
  channelsList,
  initialSearch,
  navigateToChannelCreate,
  onBack,
  onRemove,
  onRowClick,
  onSearchChange
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.channels)}>
        <Button
          onClick={navigateToChannelCreate}
          color="primary"
          variant="contained"
          data-test="add-channel"
        >
          <FormattedMessage
            defaultMessage="Create Channel"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        {/* <SearchInput
          initialSearch={initialSearch}
          onSearchChange={onSearchChange}
          // allTabLabel={intl.formatMessage({
          //   defaultMessage: "All Channels",
          //   description: "tab name"
          // })}
          // searchPlaceholder={intl.formatMessage({
          //   defaultMessage: "Search Channels"
          // })}
        /> */}
        <ResponsiveTable>
          <TableHead>
            <TableRow>
              <TableCellHeader>
                <FormattedMessage
                  defaultMessage="Channel Name"
                  description="channel name"
                />
              </TableCellHeader>
              <TableCell className={classes.colRight}>
                <FormattedMessage
                  defaultMessage="Actions"
                  description="table actions"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCollection(
              channelsList,
              channel => (
                <TableRow
                  hover={!!channel}
                  key={channel ? channel.id : "skeleton"}
                  onClick={!!channel ? onRowClick(channel.id) : undefined}
                >
                  <TableCell className={classes.colName}>
                    <span data-test="name">
                      {channel?.name || <Skeleton />}
                    </span>
                  </TableCell>
                  <TableCell className={classes.colAction}>
                    <IconButton
                      color="primary"
                      onClick={
                        channel
                          ? stopPropagation(() => onRemove(channel.id))
                          : undefined
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ),
              () => (
                <TableRow>
                  <TableCell colSpan={numberOfColumns}>
                    <FormattedMessage defaultMessage="No channels found" />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </ResponsiveTable>
      </Card>
    </Container>
  );
};

export default MultichannelsListPage;
