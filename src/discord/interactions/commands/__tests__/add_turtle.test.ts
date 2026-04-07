import addTurtleCommand from '../add_turtle';
import { TurtleRarity } from '../../../../database/models/Turtle';
import * as turtles from '../../../../turtles';

jest.mock('../../../../turtles', () => {
  const actual = jest.requireActual('../../../../turtles');
  return {
    ...actual,
    __esModule: true,
    addTurtle: jest.fn(),
  };
});

const createMockInteraction = (options: Record<string, string | null>) => ({
  deferReply: jest.fn(),
  editReply: jest.fn(),
  options: {
    getString: jest.fn((name: string) => options[name] ?? null),
  },
  user: { id: 'user_123' },
});

describe('add_turtle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should be named add_turtle', () => {
    expect(addTurtleCommand.data.name).toBe('add_turtle');
  });

  test('should reply with error for invalid URL', async () => {
    const interaction = createMockInteraction({
      image_url: 'not-a-url',
      rarity: TurtleRarity.COMMON,
    });

    // @ts-ignore
    await addTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'Invalid image URL provided.',
    );
    expect(turtles.addTurtle).not.toHaveBeenCalled();
  });

  test('should reply with error for non-http URL', async () => {
    const interaction = createMockInteraction({
      image_url: 'ftp://example.com/turtle.png',
      rarity: TurtleRarity.COMMON,
    });

    // @ts-ignore
    await addTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'Invalid image URL provided. Only http:// and https:// URLs are allowed.',
    );
    expect(turtles.addTurtle).not.toHaveBeenCalled();
  });

  test('should add turtle with name', async () => {
    (turtles.addTurtle as jest.Mock).mockResolvedValue({
      uuid: 'abc-123',
    });

    const interaction = createMockInteraction({
      image_url: 'https://example.com/turtle.png',
      rarity: TurtleRarity.COMMON,
      name: 'Shelly',
    });

    // @ts-ignore
    await addTurtleCommand.execute(interaction);

    expect(turtles.addTurtle).toHaveBeenCalledWith({
      image_url: 'https://example.com/turtle.png',
      rarity: TurtleRarity.COMMON,
      name: 'Shelly',
      added_by: 'user_123',
    });
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('abc-123'),
    );
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('Shelly'),
    );
  });

  test('should add turtle without name', async () => {
    (turtles.addTurtle as jest.Mock).mockResolvedValue({
      uuid: 'def-456',
    });

    const interaction = createMockInteraction({
      image_url: 'https://example.com/turtle.png',
      rarity: TurtleRarity.RARE,
    });

    // @ts-ignore
    await addTurtleCommand.execute(interaction);

    expect(turtles.addTurtle).toHaveBeenCalledWith({
      image_url: 'https://example.com/turtle.png',
      rarity: TurtleRarity.RARE,
      name: undefined,
      added_by: 'user_123',
    });
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.stringContaining('def-456'),
    );
  });

  test('should handle errors gracefully', async () => {
    (turtles.addTurtle as jest.Mock).mockRejectedValue(new Error('DB error'));

    const interaction = createMockInteraction({
      image_url: 'https://example.com/turtle.png',
      rarity: TurtleRarity.COMMON,
    });

    // @ts-ignore
    await addTurtleCommand.execute(interaction);

    expect(interaction.editReply).toHaveBeenCalledWith(
      'An error occurred while adding the turtle.',
    );
  });
});
