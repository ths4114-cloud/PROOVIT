'use client';

import { useSyncExternalStore } from 'react';
import {
  completeDemoMission,
  DEMO_STORAGE_KEY,
  initialDemoState,
  parseDemoState,
  type DemoState,
} from './state';

type Snapshot = { ready: boolean; state: DemoState; warning: string };
const serverSnapshot: Snapshot = { ready: false, state: initialDemoState, warning: '' };
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((listener) => listener());
}
function readStorage() {
  try {
    snapshot = {
      ready: true,
      state: parseDemoState(localStorage.getItem(DEMO_STORAGE_KEY)),
      warning: '',
    };
  } catch {
    snapshot = {
      ready: true,
      state: initialDemoState,
      warning:
        '저장된 데모 기록을 읽지 못했어요. 초기 상태로 시작합니다. 저장이 차단되면 새로고침 시 진행 상태가 사라질 수 있어요.',
    };
  }
}
function getSnapshot() {
  if (!snapshot.ready && typeof window !== 'undefined') readStorage();
  return snapshot;
}
function storageChanged(event: StorageEvent) {
  if (event.key !== DEMO_STORAGE_KEY && event.key !== null) return;
  readStorage();
  emit();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener('storage', storageChanged);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener('storage', storageChanged);
  };
}
function save(state: DemoState) {
  let warning = '';
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  } catch {
    warning =
      '브라우저에 저장하지 못했어요. 현재 화면에서는 진행할 수 있지만 새로고침하면 기록이 사라질 수 있어요.';
  }
  snapshot = { ready: true, state, warning };
  emit();
}
export const enterDemo = () => save({ ...getSnapshot().state, entered: true });
export const submitDemo = () => save(completeDemoMission(getSnapshot().state));
export const resetDemo = () => save(initialDemoState);
export function useDemo() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
