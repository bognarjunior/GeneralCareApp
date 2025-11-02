export type VitalsFilterValue = 'today' | '7d' | '30d' | '90d' | 'all';

export type VitalsFilterOption = {
  label: string;
  value: Exclude<VitalsFilterValue, 'all'>;
};

export interface VitalsFiltersProps {
  value: VitalsFilterValue;
  onChange: (v: VitalsFilterValue) => void;
  testID?: string;
  scrollable?: boolean;
  compact?: boolean;
  options?: VitalsFilterOption[];
}
