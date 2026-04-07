import turtleStatsCommand from '../turtle_stats';
import { TurtleRarity } from '../../../../database/models/Turtle';
import Turtle from '../../../../database/models/Turtle';
import TurtleCollection from '../../../../database/models/TurtleCollection';
import * as turtles from '../../../../turtles';

jest.mock('../../../../turtles', () => {
  const actual = jest.requireActual('../../../../turtles');
  return {
    ...actual,
    __esModule: true,
    getTurtleByUuid: jest.fn(),
  };
});

jest.mock('../../../../database/models/TurtleCollection', () => ({
  __esModule: true,
  default: {
    count: jest.fn(),
  },
}));

const createMockInteraction = (options: Record<string, string | null>) => ({
  deferReply: jest.fn(),
  editReply: jest.fn(),
  options: {
    getString: jest.fn((name: string) => options[name] ?? null),
  },
  user: { id: 'user_123' },
});

describe('turtle_stats execute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should be named turtle_stats', () => {
    expect(turtleStatsCommand.data.name).toBe('turtle_stats');
  });

  test('should defer reply as ephemeral', async () => {
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue(undefined);
    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await turtleStatsCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalledWith({ ephemeral: true });
  });

  test('should reply with error when turtle is not found', async () => {
    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue(undefined);
    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await turtleStatsCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'No turtle found with UUID `abc-123`.',
    );
  });

  test('should show turtle stats with encounter count', async () => {
    const mockTurtle = {
      id: 1,
      uuid: 'abc-123',
      name: 'Shelly',
      rarity: TurtleRarity.COMMON,
      image_url: 'https://example.com/shelly.png',
    } as Turtle;

    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue(mockTurtle);
    (TurtleCollection.count as jest.Mock).mockResolvedValue(42);

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await turtleStatsCommand.execute(interaction);

    expect(TurtleCollection.count).toHaveBeenCalledWith({
      where: { turtle_id: 1 },
    });

    const embed = (interaction.editReply as jest.Mock).mock.calls[0][0]
      .embeds[0];
    expect(embed.title).toContain('Shelly');
    expect(embed.description).toContain('42 players');
    expect(embed.description).toContain('Common');
    expect(embed.description).toContain('abc-123');
  });

  test('should use fallback name when turtle has no name', async () => {
    const mockTurtle = {
      id: 5,
      uuid: 'def-456',
      name: null as string | null,
      rarity: TurtleRarity.RARE,
      image_url: 'https://example.com/turtle.png',
    } as Turtle;

    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue(mockTurtle);
    (TurtleCollection.count as jest.Mock).mockResolvedValue(0);

    const interaction = createMockInteraction({ uuid: 'def-456' });

    // @ts-ignore
    await turtleStatsCommand.execute(interaction);

    const embed = (interaction.editReply as jest.Mock).mock.calls[0][0]
      .embeds[0];
    expect(embed.title).toContain('Turtle #5');
  });

  test('should use singular "player" for count of 1', async () => {
    const mockTurtle = {
      id: 1,
      uuid: 'abc-123',
      name: 'Shelly',
      rarity: TurtleRarity.COMMON,
      image_url: 'https://example.com/shelly.png',
    } as Turtle;

    (turtles.getTurtleByUuid as jest.Mock).mockReturnValue(mockTurtle);
    (TurtleCollection.count as jest.Mock).mockResolvedValue(1);

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await turtleStatsCommand.execute(interaction);

    const embed = (interaction.editReply as jest.Mock).mock.calls[0][0]
      .embeds[0];
    expect(embed.description).toContain('1 player');
    expect(embed.description).not.toContain('1 players');
  });

  test('should handle errors gracefully', async () => {
    (turtles.getTurtleByUuid as jest.Mock).mockImplementation(() => {
      throw new Error('Cache error');
    });

    const interaction = createMockInteraction({ uuid: 'abc-123' });

    // @ts-ignore
    await turtleStatsCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'An error occurred while fetching turtle stats.',
    );
  });
});
