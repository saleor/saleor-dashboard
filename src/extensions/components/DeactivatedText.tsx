import { Text } from "@saleor/macaw-ui-next";

interface DeactivatedTextProps {
  children: React.ReactNode;
}

export const DeactivatedText = ({ children }: DeactivatedTextProps) => {
  return (
    <Text fontStyle="italic">
      {children}
    </Text>
  );
};

export default DeactivatedText;