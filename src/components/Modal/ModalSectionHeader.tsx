import { Text } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

interface ModalSectionHeaderProps {
  children: ReactNode;
}

/**
 * Consistent section header for modal dialogs.
 * Use this for labeling sections within modal body content.
 *
 * @example
 * <ModalSectionHeader>Select amount to capture</ModalSectionHeader>
 */
export const ModalSectionHeader = ({ children }: ModalSectionHeaderProps) => (
  <Text size={5} fontWeight="bold">
    {children}
  </Text>
);
