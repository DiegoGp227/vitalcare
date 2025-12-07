import { ConsultationHeader } from "../molecules/ConsultationHeader";
import { PatientDetails } from "../molecules/PatientDetails";
import { ConsultationNotes } from "../molecules/ConsultationNotes";
import { AssignedPatient } from "@/src/types/doctor";

interface PatientConsultationProps {
  patient: AssignedPatient;
  onEndConsultation: () => void;
  onSaveNotes?: (notes: string) => void;
}

export function PatientConsultation({
  patient,
  onEndConsultation,
  onSaveNotes
}: PatientConsultationProps) {
  return (
    <div className="space-y-6">
      <ConsultationHeader
        patient={patient}
        onEndConsultation={onEndConsultation}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientDetails patient={patient} />
        <ConsultationNotes onSaveNotes={onSaveNotes} />
      </div>
    </div>
  );
}
