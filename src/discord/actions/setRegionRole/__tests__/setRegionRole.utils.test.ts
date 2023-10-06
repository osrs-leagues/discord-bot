import { getRegionCombination, getRegionRoles } from '../setRegionRole.utils';

describe('setRegionRole.utils', () => {
  test('getRegionCombination basic', () => {
    expect(getRegionCombination(['Asgarnia', 'Desert', 'Zeah'])).toBe('A/D/Z');
  });

  test('getRegionCombination sorting', () => {
    expect(getRegionCombination(['Zeah', 'Desert', 'Asgarnia'])).toBe('A/D/Z');
  });

  test('getRegionCombination uppercase', () => {
    expect(getRegionCombination(['zeah', 'desert', 'asgarnia'])).toBe('A/D/Z');
  });

  test('getRegionRoles', () => {
    expect(
      getRegionRoles([
        // @ts-ignore Do not require entire Role object
        { name: 'A/B/C' },
        // @ts-ignore Do not require entire Role object
        { name: 'Test' },
        // @ts-ignore Do not require entire Role object
        { name: 'Z/X/Y' },
        // @ts-ignore Do not require entire Role object
        { name: 'X/Y' },
        // @ts-ignore Do not require entire Role object
        { name: 'Test / Test' },
      ]),
    ).toEqual([{ name: 'A/B/C' }, { name: 'Z/X/Y' }]);
  });
});
