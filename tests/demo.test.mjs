import assert from 'node:assert/strict';
import test from 'node:test';
import {
  completeDemoMission,
  demoTotal,
  initialDemoState,
  parseDemoState,
} from '../src/lib/demo/state.ts';

test('demo completion is idempotent and does not award before entry', () => {
  assert.equal(demoTotal(completeDemoMission(initialDemoState)), 0);
  const entered = { ...initialDemoState, entered: true };
  assert.equal(demoTotal(entered), 1100);
  const completed = completeDemoMission(entered);
  assert.equal(demoTotal(completed), 1200);
  assert.deepEqual(completeDemoMission(completed), completed);
  assert.equal(demoTotal(initialDemoState), 0);
});

test('demo persistence validates version and fields and discards arbitrary data', () => {
  assert.deepEqual(parseDemoState(null), initialDemoState);
  for (const raw of [
    'oops',
    'null',
    '[]',
    '{"version":2}',
    '{"version":1,"entered":false,"completedToday":true}',
  ]) {
    assert.throws(() => parseDemoState(raw));
  }
  assert.deepEqual(
    parseDemoState(JSON.stringify({ ...initialDemoState, photo: 'private', score: 9000 })),
    initialDemoState,
  );
});
