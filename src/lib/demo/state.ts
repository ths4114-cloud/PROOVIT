// Presentation fixtures only: never import into participant APIs or score policy.
export const DEMO_STORAGE_KEY = 'proovit.demo.v1';
export const DEMO_DAY = 12;
export type DemoState = { version: 1; entered: boolean; completedToday: boolean };
export const initialDemoState: DemoState = { version: 1, entered: false, completedToday: false };

export function parseDemoState(raw: string | null): DemoState {
  if (raw === null) return initialDemoState;
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('Invalid demo state');
  const state = value as Record<string, unknown>;
  if (
    state.version !== 1 ||
    typeof state.entered !== 'boolean' ||
    typeof state.completedToday !== 'boolean' ||
    (!state.entered && state.completedToday)
  ) {
    throw new Error('Invalid demo state');
  }
  // Do not retain arbitrary fields (especially photos or identity data).
  return { version: 1, entered: state.entered, completedToday: state.completedToday };
}

export function completeDemoMission(state: DemoState): DemoState {
  return state.entered ? { ...state, completedToday: true } : state;
}

export function demoTotal(state: DemoState): number {
  return state.entered ? 1100 + (state.completedToday ? 100 : 0) : 0;
}
