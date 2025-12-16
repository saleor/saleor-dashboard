interface VerticalSpacerProps {
  spacing?: number;
}

const VerticalSpacer = ({ spacing = 1 }: VerticalSpacerProps) => {
  return <div style={{ height: spacing * 8 }} />;
};

export default VerticalSpacer;
