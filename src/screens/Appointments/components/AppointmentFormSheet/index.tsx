import React, { useState } from 'react';
import { View } from 'react-native';
import FormSheet from '@/components/FormSheet';
import FormDateField from '@/components/FormDateField';
import FormTextField from '@/components/FormTextField';
import Button from '@/components/Button';
import styles from './styles';
import { useAppointments } from '@/hooks/useAppointments';
import type { Appointment } from '@/repositories/appointmentsRepository';

interface AppointmentFormSheetProps {
  visible: boolean;
  onClose: () => void;
  personId: string;
  preset: Appointment | null;
  onSaved: () => void;
}

const AppointmentFormSheet: React.FC<AppointmentFormSheetProps> = ({
  visible,
  onClose,
  personId,
  preset,
  onSaved,
}) => {
  const { create, update } = useAppointments(personId);

  const editing = Boolean(preset?.id);

  const [dateISO, setDateISO] = useState<string>(preset?.dateISO ?? new Date().toISOString());
  const [doctor, setDoctor] = useState<string>(preset?.doctor ?? '');
  const [specialty, setSpecialty] = useState<string>(preset?.specialty ?? '');
  const [location, setLocation] = useState<string>(preset?.location ?? '');
  const [notes, setNotes] = useState<string>(preset?.notes ?? '');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setDateISO(preset?.dateISO ?? new Date().toISOString());
      setDoctor(preset?.doctor ?? '');
      setSpecialty(preset?.specialty ?? '');
      setLocation(preset?.location ?? '');
      setNotes(preset?.notes ?? '');
    }
  }, [visible, preset]);

  async function handleSave() {
    setSaving(true);
    try {
      if (editing && preset?.id) {
        await update(preset.id, {
          dateISO,
          doctor: doctor.trim() || undefined,
          specialty: specialty.trim() || undefined,
          location: location.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await create({
          personId,
          dateISO,
          doctor: doctor.trim() || undefined,
          specialty: specialty.trim() || undefined,
          location: location.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <Button.Group direction="column">
      <Button
        variant="primary"
        label={editing ? 'Salvar alterações' : 'Salvar'}
        onPress={handleSave}
        disabled={saving}
        gradient
        testID="apt-save"
      />
      <Button
        variant="ghost"
        label="Cancelar"
        onPress={onClose}
        disabled={saving}
        testID="apt-cancel"
      />
    </Button.Group>
  );

  return (
    <FormSheet
      visible={visible}
      onClose={onClose}
      title={editing ? 'Editar Consulta' : 'Nova Consulta'}
      footer={footer}
    >
      <View style={styles.group}>
        <FormDateField
          label="Data e hora"
          value={dateISO}
          onChangeText={setDateISO}
          mode="datetime"
          testID="apt-date"
        />

        <FormTextField
          label="Médico"
          placeholder="Ex.: Dr. João Silva"
          value={doctor}
          onChangeText={setDoctor}
          testID="apt-doctor"
        />

        <FormTextField
          label="Especialidade"
          placeholder="Ex.: Cardiologia"
          value={specialty}
          onChangeText={setSpecialty}
          testID="apt-specialty"
        />

        <FormTextField
          label="Local"
          placeholder="Ex.: Hospital Central"
          value={location}
          onChangeText={setLocation}
          testID="apt-location"
        />

        <FormTextField
          label="Observações"
          placeholder="Opcional"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
          testID="apt-notes"
        />

      </View>
    </FormSheet>
  );
};

export default AppointmentFormSheet;
