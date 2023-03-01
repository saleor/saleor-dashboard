import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellHeader from "@dashboard/components/TableCellHeader";
import TableRowLink from "@dashboard/components/TableRowLink";
import { WebhookDetailsFragment } from "@dashboard/graphql";
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

export interface WebhookLogListProps {
  webhook: WebhookDetailsFragment;
}

const WebhookLogList: React.FC<WebhookLogListProps> = ({ webhook }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://log.saleor.online/log/${webhook.app.id}/${webhook.id}`,
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        //
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ResponsiveTable>
      <TableHead>
        <TableRowLink>
          <TableCellHeader>
            <FormattedMessage id="qlcuNQ" defaultMessage="ID" />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage
              id="ieLRlo"
              defaultMessage="Event"
              description="date when order was placed"
            />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage
              id="NH9/nC"
              defaultMessage="Status"
              description="e-mail or full name"
            />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage
              id="Jpgi+q"
              defaultMessage="Time"
              description="payment status"
            />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage id="IuFETn" defaultMessage="Duration" />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage
              id="Z2ZNVF"
              defaultMessage="Result"
              description="total order price"
            />
          </TableCellHeader>
        </TableRowLink>
      </TableHead>
      <TableFooter>
        <TableRowLink>row link</TableRowLink>
      </TableFooter>
      <TableBody>
        {data.map((entry: any) => (
          <TableRowLink data-test-id="order-table-row">
            <TableCell>{entry.id}</TableCell>
            <TableCell>{entry.event}</TableCell>
            <TableCell>{entry.status}</TableCell>
            <TableCell>{entry.time}</TableCell>
            <TableCell>{entry.duration}</TableCell>
            <TableCell>{entry.result}</TableCell>
          </TableRowLink>
        ))}
      </TableBody>
    </ResponsiveTable>
  );
};

WebhookLogList.displayName = "WebhookLogList";
export default WebhookLogList;
