/** Display contracts, not a database schema. Score and availability come from the server. */
export type MissionStatus =
  'locked' | 'available' | 'processing' | 'accepted' | 'failed' | 'missed';
export type Phase = 'DEFINE' | 'DISCOVER' | 'VALIDATE' | 'DESIGN' | 'BUILD' | 'LAUNCH';
export interface MissionSummary {
  id: string;
  day: number;
  title: string;
  phase: Phase;
  status: MissionStatus;
  availableScore: number;
  awardedScore: number | null;
  opensAt: string;
  proofCloseAt: string;
}
export interface MissionDetail extends MissionSummary {
  description: string;
  steps: readonly string[];
  submissionItems: readonly string[];
  completionCriteria: readonly string[];
  proofGuide: string;
}
export interface ScoreResult {
  missionId: string;
  status: 'accepted';
  awardedScore: number;
  totalScore: number;
  verificationMode: 'capture_auto_accept';
  policyVersion: string;
}
export type ApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        code:
          | 'UNAUTHENTICATED'
          | 'FORBIDDEN'
          | 'NOT_FOUND'
          | 'NOT_READY'
          | 'CONFLICT'
          | 'UNAVAILABLE'
          | 'INVALID_INPUT'
          | 'INVALID_IMAGE'
          | 'IMAGE_TOO_LARGE'
          | 'KEY_CONFLICT'
          | 'PROCESSING'
          | 'RETRY_REQUIRED'
          | 'RATE_LIMIT';
        message?: string;
      };
    };
export const missionLabels: Record<MissionStatus, string> = {
  locked: '해금 전',
  available: '도전 가능',
  processing: '처리 중',
  accepted: '인증 완료',
  failed: '다시 시도',
  missed: '제출 종료',
};
