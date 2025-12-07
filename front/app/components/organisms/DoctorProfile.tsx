import { DoctorInfo } from "../molecules/DoctorInfo";
import { DoctorStats } from "../molecules/DoctorStats";
import { DoctorInfo as DoctorInfoType, DoctorStats as DoctorStatsType } from "@/app/types/doctor";

interface DoctorProfileProps {
  doctor: DoctorInfoType;
  stats: DoctorStatsType;
}

export function DoctorProfile({ doctor, stats }: DoctorProfileProps) {
  return (
    <div className="w-1/3">
      <div className="mb-6">
        <DoctorInfo doctor={doctor} />
      </div>
      <DoctorStats stats={stats} />
    </div>
  );
}
