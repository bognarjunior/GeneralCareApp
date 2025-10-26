import React from 'react';
import VitalsCard from '@/components/VitalsCard';
import type { MeasurementCardProps } from '@/types/components/MeasurementCard';

const MeasurementCard: React.FC<MeasurementCardProps> = ({ item, onEdit, onDelete, testID = 'measurement-card' }) => {
  return (
    <VitalsCard
      dateISO={item.dateISO}
      value={item.weightKg}
      unit="kg"
      metaLeft={`${item.heightCm} cm • IMC ${item.bmi}`}
      notes={item.notes}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item.id)}
      testID={testID}
    />
  );
};

export default MeasurementCard;
