import turtleClogCommand from '../turtle_clog';
import { TurtleRarity } from '../../../../database/models/Turtle';
import Turtle from '../../../../database/models/Turtle';
import * as turtles from '../../../../turtles';

jest.mock('../../../../turtles', () => {
  const actual = jest.requireActual('../../../../turtles');
  return {
    ...actual,
    __esModule: true,
    turtleCache: {
      turtles: [],
      uuidMap: new Map(),
      totalWeight: 0,
    },
    getCollectedTurtleIds: jest.fn(),
  };
});

const createMockInteraction = () => ({
  deferReply: jest.fn(),
  editReply: jest.fn(),
  user: { id: 'user_123' },
});

describe('turtle_clog execute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should defer reply as ephemeral', async () => {
    turtles.turtleCache.turtles = [];
    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleClogCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
  });

  test('should reply with no turtles message when cache is empty', async () => {
    turtles.turtleCache.turtles = [];
    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleClogCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'No turtles available yet!',
    );
  });

  test('should show collection log with collected turtles', async () => {
    const mockTurtles = [
      { id: 1, name: 'Shelly', rarity: TurtleRarity.COMMON } as Turtle,
      { id: 2, name: 'Spike', rarity: TurtleRarity.RARE } as Turtle,
    ];

    turtles.turtleCache.turtles = mockTurtles;
    (turtles.getCollectedTurtleIds as jest.Mock).mockResolvedValue(
      new Set([1]),
    );

    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleClogCommand.execute(interaction);

    expect(turtles.getCollectedTurtleIds).toHaveBeenCalledWith('user_123');
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: expect.any(Array) }),
    );
  });

  test('should show empty collection for new user', async () => {
    const mockTurtles = [
      { id: 1, name: 'Shelly', rarity: TurtleRarity.COMMON } as Turtle,
    ];

    turtles.turtleCache.turtles = mockTurtles;
    (turtles.getCollectedTurtleIds as jest.Mock).mockResolvedValue(
      new Set<number>(),
    );

    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleClogCommand.execute(interaction);

    const embed = (interaction.editReply as jest.Mock).mock.calls[0][0]
      .embeds[0];
    expect(embed.description).toContain('0');
  });

  test('should handle errors gracefully', async () => {
    turtles.turtleCache.turtles = [{ id: 1 }] as Turtle[];
    (turtles.getCollectedTurtleIds as jest.Mock).mockRejectedValue(
      new Error('DB error'),
    );

    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleClogCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'An error occurred while fetching your turtle log.',
    );
  });
});
