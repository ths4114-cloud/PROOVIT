import 'server-only';
import type { MissionDetail } from '../contracts';
import { missionContents } from './mission-content';

export const previewMissions: MissionDetail[] = missionContents.map((content) => {
  const { day } = content;
  return {
    ...content,
    id: `day-${day}`,
    day,
    status: day < 12 ? 'accepted' : day === 12 ? 'available' : 'locked',
    availableScore: day === 12 ? 100 : 0,
    awardedScore: day < 12 ? 100 : null,
    opensAt: `2026-10-${String(day).padStart(2, '0')}T00:00:00+09:00`,
    proofCloseAt: '2026-11-04T00:00:00+09:00',
  };
});
export const todayMission = previewMissions[11];
export function getPreviewMission(id: string) {
  return previewMissions.find((mission) => mission.id === id);
}
