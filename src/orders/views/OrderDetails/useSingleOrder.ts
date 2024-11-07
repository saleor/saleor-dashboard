import { useSingleOrderQuery } from "@dashboard/graphql";
import { useHasManageProductsPermission } from "@dashboard/orders/hooks/useHasManageProductsPermission";

export const useSingleOrder = (id: string) => {
  const hasManageProducts = useHasManageProductsPermission();
  const { data, loading } = useSingleOrderQuery({
    variables: { id, hasManageProducts },
  });

  const fulfillments = data?.order?.fulfillments.map(fulfillment => {
    const lines = fulfillment.lines.map(line => {
      const orderLine = data?.order?.lines.find(orderLine => orderLine.id === line.orderLine.id);

      return {
        ...line,
        orderLine,
      };
    });

    return {
      ...fulfillment,
      lines,
    };
  });

  return {
    data: {
      ...data,
      order: data?.order
        ? {
            ...data.order,
            fulfillments,
          }
        : data?.order,
    },
    loading,
  };
};
