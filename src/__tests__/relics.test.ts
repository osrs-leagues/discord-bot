import { getRandomRelics, getRelicEmoji } from '../relics';

describe('relics', () => {
  describe('getRelicEmoji', () => {
    it('should return the emoji name for a relic', () => {
      expect(getRelicEmoji('Power Miner')).toBe('echopowerminer');
    });

    it('should return the emoji name for a relic with special characters', () => {
      expect(getRelicEmoji("Banker's Note")).toBe('echobankersnote');
    });
  });

  describe('getRandomRelics', () => {
    it('should return 8 random relics', () => {
      const relics = getRandomRelics();
      expect(relics).toHaveLength(8);
    });
  });
});
