import React from 'react';
import VitalsCard from '@/components/VitalsCard';
import type { BloodPressureCardProps } from '@/types/components/BloodPressureCard';
import { classify } from '@/repositories/bloodPressureRepository';
import type { BloodPressureClassification } from '@/repositories/bloodPressureRepository';

const classificationLabel: Record<BloodPressureClassification, string> = {
  normal: 'Normal',
  elevated: 'Elevada',
  hypertension_1: 'Hipertensão grau 1',
  hypertension_2: 'Hipertensão grau 2',
};

const BloodPressureCard: React.FC<BloodPressureCardProps> = ({
  item,
  onEdit,
  onDelete,
  testID = 'blood-pressure-card',
}) => {
  const classification = classify(item.systolic, item.diastolic);
  const label = classificationLabel[classification];

  const meta = [
    label,
    item.pulse ? `${item.pulse} bpm` : null,
    item.arm === 'left' ? 'Braço esquerdo' : item.arm === 'right' ? 'Braço direito' : null,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <VitalsCard
      dateISO={item.dateISO}
      value={`${item.systolic}/${item.diastolic}`}
      unit="mmHg"
      metaLeft={meta}
      notes={item.notes}
      onEdit={() => onEdit(item)}
      onDelete={() => onDelete(item.id)}
      testID={testID}
    />
  );
};

export default BloodPressureCard;
