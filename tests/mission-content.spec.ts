import { expect, test } from '@playwright/test';
import { missionContents } from '../src/lib/preview/mission-content';

test('31 days have unique ordered content and complete camera proof instructions', () => {
  expect(missionContents.map(({ day }) => day)).toEqual(
    Array.from({ length: 31 }, (_, index) => index + 1),
  );
  for (const mission of missionContents) {
    for (const value of [mission.title, mission.description, mission.proofGuide]) {
      expect(value.trim()).not.toBe('');
    }
    for (const items of [mission.steps, mission.submissionItems, mission.completionCriteria]) {
      expect(items.length).toBeGreaterThan(0);
      expect(items.every((item) => item.trim().length > 0)).toBe(true);
    }
    expect(mission.proofGuide).toContain('앱 카메라');
  }
  expect(missionContents[17].title).toBe('GO 또는 해결책 방향 조정을 결정하세요');
  expect(missionContents[17].description).toContain('공식 Project Pivot이 아니라');
  for (const day of [10, 11, 12, 13, 14, 17, 28, 31]) {
    expect(missionContents[day - 1].proofGuide).toMatch(/개인정보|개인을 알아볼|이름, 연락처/);
    expect(missionContents[day - 1].proofGuide).toContain('가린');
  }
  for (const day of [30, 31]) {
    expect(missionContents[day - 1].proofGuide).toContain('별도의 Final Submission');
  }
});
