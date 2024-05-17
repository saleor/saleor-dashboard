export const isAvailableOrPublished = ({
  condition,
  date,
  now,
}: {
  condition: boolean;
  date: string;
  now: number;
}) => condition && date && Date.parse(date) < now;
