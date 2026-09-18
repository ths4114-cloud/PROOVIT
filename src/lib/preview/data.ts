import 'server-only';
import type { MissionDetail, Phase } from '../contracts';
const phases: Phase[] = ['DEFINE', 'DISCOVER', 'VALIDATE', 'DESIGN', 'BUILD', 'LAUNCH'];
export const previewMissions: MissionDetail[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const phase =
    phases[day <= 5 ? 0 : day <= 10 ? 1 : day <= 18 ? 2 : day <= 23 ? 3 : day <= 29 ? 4 : 5];
  return {
    id: `day-${day}`,
    day,
    title: day === 12 ? '고객 인터뷰 질문 7개 만들기' : `${phase} 미션 ${day} (예시)`,
    phase,
    status: day < 12 ? 'accepted' : day === 12 ? 'available' : 'locked',
    availableScore: day === 12 ? 100 : 0,
    awardedScore: day < 12 ? 100 : null,
    opensAt: `2026-10-${String(day).padStart(2, '0')}T00:00:00+09:00`,
    proofCloseAt: '2026-11-04T00:00:00+09:00',
    description: '고객의 문제를 이해할 수 있도록 구체적인 질문을 준비하세요.',
    steps: [
      '타깃 고객의 주요 고민 3가지 정리하기',
      '고민을 깊이 이해할 수 있는 질문 작성하기',
      '자연스러운 대화 흐름으로 질문 7개 정리하기',
    ],
    proofGuide:
      '작성한 질문이 읽히도록 결과물을 촬영하세요. 이름·연락처 등 개인정보는 사진에 포함하지 마세요.',
  };
});
export const todayMission = previewMissions[11];
export function getPreviewMission(id: string) {
  return previewMissions.find((mission) => mission.id === id);
}
