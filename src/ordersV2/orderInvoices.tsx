import { InvoiceFragment } from "@dashboard/graphql";
import { Box, Button, PropsWithBox, sprinkles, Text } from "@saleor/macaw-ui-next";
import { Send } from "lucide-react";
import { useIntl } from "react-intl";

type Props = PropsWithBox<{
  invoices: InvoiceFragment[];
}>;

export const OrderInvoices = ({ invoices }: Props) => {
  const intl = useIntl();

  return (
    <Box padding={6} gap={4} display="grid">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={5} fontWeight="medium">
          Invoices
        </Text>
        <Button variant="secondary">
          {intl.formatMessage({
            defaultMessage: "Generate",
            id: "Pc+tM3",
          })}
        </Button>
      </Box>
      <Box>
        <Box>
          {invoices.map(invoice => (
            <Box
              key={invoice.id}
              onClick={() => {
                // TODO: implement send invoice functionality
                alert("Invoice sent clicked");
              }}
              display="grid"
              __gridTemplateColumns="1fr auto auto"
              placeItems="center"
              marginBottom={4}
            >
              <Box display="flex" flexDirection="column" gap={1}>
                <Text>{invoice.number}</Text>
                <Text color="default2" size={2}>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Generated {date}",
                      id: "gQtMz8",
                    },
                    {
                      date: intl.formatDate(invoice.createdAt, {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    },
                  )}
                </Text>
              </Box>

              <Button
                variant="tertiary"
                alignSelf="center"
                icon={<Send size={16} className={sprinkles({ color: "default2" })} />}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
