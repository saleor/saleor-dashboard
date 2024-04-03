import { TopNav } from "@dashboard/components/AppLayout";
import { DashboardCard } from "@dashboard/components/Card";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { orderUrl } from "@dashboard/orders/urls";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { OrderTransactionTiles } from "./components/OrderTransactionTile";

interface OrderManualTransationRefundProps {
  data: any;
  loading: boolean;
  submitLoading: boolean;
  onSubmit: (transationId: string, amount: number) => void;
}

export const OrderManualTransationRefundPage = ({
  data,
  loading,
  submitLoading,
  onSubmit,
}: OrderManualTransationRefundProps) => {
  const methods = useForm();

  const handleSubmit = data => {
    onSubmit(data.transaction, data.amount);
  };

  if (loading) {
    return <div>loading.</div>;
  }

  return (
    <FormProvider {...methods}>
      <form
        id="manual-refund-form"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav href={orderUrl(data?.order?.id)} title={"Transactions"} />
          <DetailPageLayout.Content>
            <DashboardCard>
              <DashboardCard.Content>
                <Text size={4} marginY={5} display="block" fontWeight="bold">
                  Select a refund you want to fullfill
                </Text>
              </DashboardCard.Content>
            </DashboardCard>

            <OrderTransactionTiles transactions={data?.order?.transactions} />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <Box
              __maxWidth={400}
              height="100%"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <DashboardCard>
                <DashboardCard.Title>Refund fullfilling</DashboardCard.Title>
                <DashboardCard.Content>
                  <Text as="p">
                    You are now selecting which granted refund you want to
                    fullfill and send to a customer.
                  </Text>
                </DashboardCard.Content>
              </DashboardCard>

              <DashboardCard>
                <DashboardCard.Content>
                  <Box display="grid" gap={4} marginTop="auto">
                    <Controller
                      name="amount"
                      render={({
                        field: { value, onChange, ...field },
                        fieldState: { error },
                      }) => (
                        <Input
                          {...field}
                          value={value}
                          label="Refund amount"
                          type="number"
                          endAdornment={"USD"}
                          onChange={e => onChange(e.target.value)}
                          error={!!error}
                        />
                      )}
                    />
                  </Box>
                </DashboardCard.Content>
              </DashboardCard>
            </Box>
          </DetailPageLayout.RightSidebar>
          <Button type="submit">Submit</Button>
        </DetailPageLayout>
      </form>
    </FormProvider>
  );
};
