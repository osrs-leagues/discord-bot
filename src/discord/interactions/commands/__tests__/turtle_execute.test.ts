import turtleCommand from '../turtle';
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
    selectWeightedTurtle: jest.fn(),
    recordTurtleDiscovery: jest.fn(),
  };
});

const createMockInteraction = () => ({
  deferReply: jest.fn(),
  editReply: jest.fn(),
  user: { id: 'user_123' },
});

describe('turtle execute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should reply with no turtles message when cache is empty', async () => {
    turtles.turtleCache.turtles = [];
    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleCommand.execute(interaction);

    expect(interaction.deferReply).toHaveBeenCalled();
    expect(interaction.editReply).toHaveBeenCalledWith(
      'No turtles available yet!',
    );
  });

  test('should roll a turtle and reply with embed', async () => {
    const mockTurtle = {
      id: 1,
      name: 'Shelly',
      rarity: TurtleRarity.COMMON,
      image_url: 'https://example.com/shelly.png',
    } as Turtle;

    turtles.turtleCache.turtles = [mockTurtle];
    (turtles.selectWeightedTurtle as jest.Mock).mockReturnValue(mockTurtle);
    (turtles.recordTurtleDiscovery as jest.Mock).mockResolvedValue(true);

    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleCommand.execute(interaction);

    expect(turtles.selectWeightedTurtle).toHaveBeenCalledWith([mockTurtle]);
    expect(turtles.recordTurtleDiscovery).toHaveBeenCalledWith('user_123', 1);
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: expect.any(Array) }),
    );
  });

  test('should pass isNewDiscovery to message when true', async () => {
    const mockTurtle = {
      id: 1,
      name: 'Shelly',
      rarity: TurtleRarity.COMMON,
      image_url: 'https://example.com/shelly.png',
    } as Turtle;

    turtles.turtleCache.turtles = [mockTurtle];
    (turtles.selectWeightedTurtle as jest.Mock).mockReturnValue(mockTurtle);
    (turtles.recordTurtleDiscovery as jest.Mock).mockResolvedValue(true);

    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleCommand.execute(interaction);

    const embed = (interaction.editReply as jest.Mock).mock.calls[0][0]
      .embeds[0];
    expect(embed.description).toContain('New Discovery');
  });

  test('should not show discovery tag when not new', async () => {
    const mockTurtle = {
      id: 1,
      name: 'Shelly',
      rarity: TurtleRarity.COMMON,
      image_url: 'https://example.com/shelly.png',
    } as Turtle;

    turtles.turtleCache.turtles = [mockTurtle];
    (turtles.selectWeightedTurtle as jest.Mock).mockReturnValue(mockTurtle);
    (turtles.recordTurtleDiscovery as jest.Mock).mockResolvedValue(false);

    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleCommand.execute(interaction);

    const embed = (interaction.editReply as jest.Mock).mock.calls[0][0]
      .embeds[0];
    expect(embed.description).not.toContain('New Discovery');
  });

  test('should handle errors gracefully', async () => {
    turtles.turtleCache.turtles = [{ id: 1 }] as Turtle[];
    (turtles.selectWeightedTurtle as jest.Mock).mockImplementation(() => {
      throw new Error('Random error');
    });

    const interaction = createMockInteraction();

    // @ts-ignore
    await turtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'An error occurred while rolling a turtle.',
    );
  });
});
