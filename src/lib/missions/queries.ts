import 'server-only';
import { getContext, logFailure } from '@/lib/data';
import { challengeSlug } from '@/lib/env';
import type { MissionDetail } from '@/lib/contracts';

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type DetailResponse = MissionDetail & { contentVersion: string | null };
export type BoardCell =
  DetailResponse | { id: null; day: number; title: null; status: 'locked' | 'unavailable' };
export interface BoardData {
  challengeId: string;
  title: string;
  serverNow: string;
  missions: BoardCell[];
}

export function hasDetailContent(m: DetailResponse): boolean {
  return (
    Boolean(m.contentVersion && m.proofGuide) &&
    [m.steps, m.submissionItems, m.completionCriteria].every(
      (items) =>
        Array.isArray(items) &&
        items.length > 0 &&
        items.every((item) => typeof item === 'string' && item.trim().length > 0),
    )
  );
}

export async function getMission(id: string): Promise<DetailResponse | null> {
  if (!UUID.test(id)) return null;
  const { supabase, user } = await getContext();
  if (!user) return null;
  const { data, error } = await supabase.rpc('mission_detail', { p_mission_id: id });
  if (error) {
    logFailure('mission.read', error.code);
    throw new Error('미션을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
  return data as unknown as DetailResponse | null;
}

export async function getBoard(): Promise<BoardData | null> {
  const { supabase, user } = await getContext();
  if (!user) return null;
  const { data, error } = await supabase.rpc('mission_board', { p_slug: challengeSlug() });
  if (error) {
    logFailure('board.read', error.code);
    throw new Error('미션보드를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
  return data as unknown as BoardData | null;
}
