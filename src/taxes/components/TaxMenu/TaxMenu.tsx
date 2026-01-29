import { DashboardCard } from "@dashboard/components/Card";
import { Box, Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./TaxMenu.module.css";

interface TaxMenuItemProps {
  id: string;
  label: ReactNode;
  href: string;
  isSelected: boolean;
  action?: ReactNode;
  "data-test-id"?: string;
}

interface TaxMenuProps {
  title: string;
  columnHeader: ReactNode;
  items: TaxMenuItemProps[];
  toolbar?: ReactNode;
  placeholder?: ReactNode;
}

const TaxMenu = ({ title, columnHeader, items, toolbar, placeholder }: TaxMenuProps) => {
  const isEmpty = items.length === 0;

  return (
    <DashboardCard className={styles.menu} gap={0}>
      <DashboardCard.Header paddingX={4}>
        <DashboardCard.Title>{title}</DashboardCard.Title>
        {toolbar && <DashboardCard.Toolbar>{toolbar}</DashboardCard.Toolbar>}
      </DashboardCard.Header>
      <Box
        padding={2}
        paddingX={4}
        borderBottomWidth={1}
        borderBottomStyle="solid"
        borderColor="default1"
      >
        <Text size={2} color="default2">
          {columnHeader}
        </Text>
      </Box>
      {isEmpty && placeholder ? (
        <Box padding={4}>
          <Text color="default2">{placeholder}</Text>
        </Box>
      ) : (
        <Box as="ul" className={styles.list}>
          {items.map(item => (
            <Box
              as="li"
              key={item.id}
              __height="60px"
              position="relative"
              borderBottomWidth={1}
              borderBottomStyle="solid"
              borderColor="default1"
              className={item.isSelected ? styles.selected : undefined}
            >
              <Link to={item.href} className={styles.link} data-test-id={item["data-test-id"]}>
                <Text className={styles.ellipsis}>{item.label}</Text>
                {item.action}
              </Link>
            </Box>
          ))}
        </Box>
      )}
    </DashboardCard>
  );
};

export { TaxMenu };
