import React from 'react';
import VitalsCard from '@/components/VitalsCard';
import type { GlycemiaCardProps } from '@/types/components/GlycemiaCard';
import type { GlycemiaContext } from '@/repositories/glycemiaRepository';

const contextLabel: Record<GlycemiaContext, string> = {
  fasting: 'Jejum',
  preprandial: 'Pré-prandial',
  postprandial: 'Pós-prandial',
  random: 'Aleatória',
  bedtime: 'Ao deitar',
};

const GlycemiaCard: React.FC<GlycemiaCardProps> = ({
  item,
  onEdit,
  onDelete,
  testID = 'glycemia-card',
}) => {
  const meta =
    item.context ? contextLabel[item.context] : undefined;

  return (
    <VitalsCard
      dateISO={item.dateISO}
      value={item.valueMgDl}
      unit="mg/dL"
      metaLeft={meta}
      notes={item.notes}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item.id)}
      testID={testID}
    />
  );
};

export default GlycemiaCard;
