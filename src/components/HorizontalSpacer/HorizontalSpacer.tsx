interface HorizontalSpacerProps {
  spacing?: number;
}

const HorizontalSpacer = ({ spacing = 1 }: HorizontalSpacerProps) => {
  return <div style={{ width: spacing * 8 }} />;
};

export default HorizontalSpacer;
