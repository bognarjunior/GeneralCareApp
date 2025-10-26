export type VitalsCardProps = {
  dateISO: string;
  value: number | string;
  unit?: string;
  metaLeft?: string | React.ReactNode;
  notes?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  testID?: string;
};
